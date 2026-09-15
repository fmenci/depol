import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, NgZone, computed, effect, inject, input, output, signal, viewChild } from '@angular/core';
import { RedoxCalculation } from '../../models/redox.calculation.model';
import { ChartPadding, ChartScale, formatMagnitude, logTicks, makeScale, niceTicks } from '../../models/chart-geometry.model';
import { CORROSION_STRINGS, CorrosionLang, VERDICT_THEME, VerdictKey } from '../../models/corrosion-strings.model';

interface ReferenceCurveSpec {
    density: number;
    color: string;
    dash: string;
    width: number;
}

interface ReferenceCurve {
    spec: ReferenceCurveSpec;
    curve: RedoxCalculation;
}

interface GridXTick {
    x: number;
    y1: number;
    y2: number;
    label: string;
}

interface GridYTick {
    y: number;
    x1: number;
    x2: number;
    label: string;
}

interface AxisLabel {
    text: string;
    left: number;
    top: number;
    transform: string;
    bold: boolean;
}

interface RefPath {
    d: string;
    color: string;
    dash: string;
    width: number;
}

interface LegendChip {
    density: number;
    label: string;
    color: string;
    dash: string;
    width: number;
    on: boolean;
}

// Eight applied densities ported from the previous theecanvas.ts, re-coloured onto the Industry
// steel ramp and separated by dash pattern + stroke weight rather than lightness (design handoff
// README §"Reference curves" — every curve clears ~4.25:1 against the white plot fill).
const REFERENCE_CURVE_SPECS: ReferenceCurveSpec[] = [
    { density: 0.2, color: 'var(--color-accent-600)', dash: '2 5', width: 1.2 },
    { density: 0.5, color: 'var(--color-accent-700)', dash: '5 4', width: 1.2 },
    { density: 1.0, color: 'var(--color-neutral-700)', dash: '9 4', width: 1.2 },
    { density: 2.0, color: 'var(--color-accent-800)', dash: '13 4', width: 1.6 },
    { density: 3.0, color: 'var(--color-neutral-800)', dash: '2 4 8 4', width: 1.6 },
    { density: 5.5, color: 'var(--color-accent-700)', dash: '16 5', width: 2.2 },
    { density: 6.0, color: 'var(--color-neutral-900)', dash: '4 4', width: 2.2 },
    { density: 12.0, color: 'var(--color-accent-900)', dash: '20 5', width: 2.6 }
];

// Legend plate geometry (design handoff README §"Legend placement rule").
const PLATE = { w: 152, h: 190, inset: 8 };
// A4 portrait at 14mm margins: 182mm × 92mm plot box in CSS px at 96dpi, minus 18 (design handoff
// README §"Printing" — verified so the label overlay lands inside the plot box on paper).
const PRINT_PLOT = { w: 670, h: 348 };

const round1 = (n: number): number => Math.round(n * 10) / 10;

@Component({
    selector: 'app-theecanvas',
    templateUrl: './theecanvas.html',
    styleUrls: ['./theecanvas.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgTemplateOutlet]
})
export class TheeCanvasComponent {
    usercurve = input.required<RedoxCalculation>();
    verdictKey = input<VerdictKey>('unset');
    lang = input<CorrosionLang>('en');

    /** Emitted while dragging the operating point: inverts the model (x sets ΔE via X off, y sets i corr via I app). */
    dragMove = output<{ xoff: number; iapp: number }>();

    private readonly zone = inject(NgZone);
    private readonly destroyRef = inject(DestroyRef);

    private readonly plotBoxRef = viewChild<ElementRef<HTMLDivElement>>('plotBox');
    private readonly chartRowRef = viewChild<ElementRef<HTMLDivElement>>('chartRow');

    // Measured geometry — defaults match the plot's typical rendered size before the first
    // ResizeObserver callback fires, so the first paint isn't at 0×0.
    protected readonly w = signal(800);
    protected readonly h = signal(460);
    protected readonly rowH = signal(460);

    // Interaction state
    protected readonly xMax = signal(160);
    protected readonly yMax = signal(10);
    protected readonly logOn = signal(false);
    protected readonly refsOn = signal(true);
    protected readonly hiddenDensities = signal<ReadonlySet<number>>(new Set());
    protected readonly guide = signal<number | null>(null);
    protected readonly dragging = signal(false);
    protected readonly printing = signal(false);

    protected readonly t = computed(() => CORROSION_STRINGS[this.lang()]);
    protected readonly verdictInk = computed(() => VERDICT_THEME[this.verdictKey()].ink);
    protected readonly verdictTint = computed(() => VERDICT_THEME[this.verdictKey()].tint);

    private readonly referenceCurves: ReferenceCurve[] = REFERENCE_CURVE_SPECS.map((spec) => ({
        spec,
        curve: new RedoxCalculation(740, 618, spec.density, 1, spec.color)
    }));

    protected readonly pad = computed<ChartPadding>(() => ({
        l: this.w() < 420 ? 46 : 60,
        r: 14,
        t: 12,
        b: this.w() < 420 ? 42 : 48
    }));

    private readonly scale = computed<ChartScale>(() =>
        makeScale({ w: this.w(), h: this.h(), pad: this.pad(), xMax: this.xMax(), yMax: this.yMax(), log: this.logOn(), yMin: 0.02 })
    );

    // The legend placement decision is measured against the full chart-row height, not the plot
    // box — testing the (potentially shrunken) plot box would latch the legend out permanently
    // once the plate no longer fits (design handoff README §"Legend placement rule").
    private readonly fullRowScale = computed<ChartScale>(() =>
        makeScale({ w: this.w(), h: this.rowH() || this.h(), pad: this.pad(), xMax: this.xMax(), yMax: this.yMax(), log: this.logOn(), yMin: 0.02 })
    );

    protected readonly ok = computed(() => {
        const u = this.usercurve();
        return u.xon > 0 && u.xoff > 0 && u.measuredIntensity > 0 && u.measuredSurface > 0;
    });

    protected readonly deltaE = computed(() => Math.abs(this.usercurve().xon - this.usercurve().xoff));

    protected readonly density = computed(() => {
        const u = this.usercurve();
        return u.measuredSurface > 0 ? u.measuredIntensity / u.measuredSurface : 0;
    });

    protected readonly icorr = computed(() => (this.ok() ? this.usercurve().fx(this.deltaE() / 1000) * 1000 : 0));

    protected readonly plotRect = computed(() => {
        const pad = this.pad();
        const sc = this.scale();
        return { x: pad.l, y: pad.t, w: Math.max(10, this.w() - pad.l - pad.r), h: Math.max(10, sc.y0 - pad.t), bottom: sc.y0 };
    });

    protected readonly gridX = computed<GridXTick[]>(() => {
        const sc = this.scale();
        const pad = this.pad();
        const bottom = sc.y0;
        return niceTicks(this.xMax(), this.w() < 480 ? 4 : 8).ticks.map((val) => ({
            x: round1(sc.sx(val)), y1: pad.t, y2: bottom + 4, label: String(Math.round(val))
        }));
    });

    protected readonly gridY = computed<GridYTick[]>(() => {
        const sc = this.scale();
        const pad = this.pad();
        const yvals = this.logOn() ? logTicks(0.02, this.yMax()) : niceTicks(this.yMax(), this.h() < 320 ? 4 : 8).ticks;
        return yvals.map((val) => ({
            y: round1(sc.sy(val)), x1: pad.l - 4, x2: this.w() - pad.r, label: val >= 1 ? String(val) : String(+val.toFixed(2))
        }));
    });

    protected readonly labels = computed<AxisLabel[]>(() => {
        const pad = this.pad();
        const w = this.w();
        const h = this.h();
        const bottom = this.plotRect().bottom;
        const t = this.t();
        const out: AxisLabel[] = [];
        this.gridX().forEach((g) => out.push({ text: g.label, left: g.x, top: bottom + 8, transform: 'translate(-50%,0)', bold: false }));
        this.gridY().forEach((g) => out.push({ text: g.label, left: pad.l - 8, top: g.y, transform: 'translate(-100%,-50%)', bold: false }));
        out.push({ text: t.xLabel, left: pad.l + (w - pad.l - pad.r) / 2, top: h - 14, transform: 'translate(-50%,0)', bold: true });
        out.push({ text: t.yLabel, left: 12, top: pad.t + (bottom - pad.t) / 2, transform: 'translate(-50%,-50%) rotate(-90deg)', bold: true });
        return out;
    });

    protected readonly legendChips = computed<LegendChip[]>(() => {
        const hidden = this.hiddenDensities();
        return REFERENCE_CURVE_SPECS.map((spec) => ({
            density: spec.density, label: String(spec.density), color: spec.color, dash: spec.dash, width: spec.width,
            on: this.refsOn() && !hidden.has(spec.density)
        }));
    });

    private readonly visibleDensities = computed<number[]>(() => {
        const hidden = this.hiddenDensities();
        const dens = this.refsOn()
            ? this.referenceCurves.filter((r) => !hidden.has(r.spec.density)).map((r) => r.spec.density)
            : [];
        if (this.ok() && this.density() > 0) {
            dens.push(this.density());
        }
        return dens;
    });

    // Data-aware legend placement (design handoff README §"Legend placement rule"): the plate sits
    // in the plot's usually-empty top-right corner only while every visible curve — reference and
    // the operator's own — clears its bottom edge across its full width, checked at the full
    // chart-row height so a shrunken plot box can't be mistaken for "no room".
    protected readonly legendInPlot = computed(() => {
        const w = this.w();
        const rowH = this.rowH() || this.h();
        const pad = this.pad();
        const scFull = this.fullRowScale();
        const plateLeft = w - pad.r - PLATE.inset - PLATE.w;
        const plateBottom = PLATE.inset + PLATE.h;
        const dens = this.visibleDensities();
        const cornerFree = dens.every((d) => {
            const curve = this.curveForDensity(d);
            for (let i = 0; i <= 8; i++) {
                const px = plateLeft + ((w - pad.r - PLATE.inset - plateLeft) * i) / 8;
                const x = Math.max(scFull.ix(px), 0.01);
                const y = curve.fx(x / 1000) * 1000;
                if (!Number.isFinite(y)) {
                    continue;
                }
                if (scFull.sy(y) <= plateBottom) {
                    return false;
                }
            }
            return true;
        });
        return w >= 430 && rowH >= 260 && cornerFree;
    });

    protected readonly refPaths = computed<RefPath[]>(() => {
        if (!this.refsOn()) {
            return [];
        }
        const sc = this.scale();
        const hidden = this.hiddenDensities();
        return this.referenceCurves
            .filter((r) => !hidden.has(r.spec.density))
            .map((r) => ({ d: this.curvePathFor(r.curve, sc), color: r.spec.color, dash: r.spec.dash, width: r.spec.width }));
    });

    protected readonly userPath = computed(() => (this.ok() ? this.curvePathFor(this.usercurve(), this.scale()) : ''));

    private readonly rawOperatingPoint = computed(() => {
        const sc = this.scale();
        return { x: this.ok() ? sc.sx(this.deltaE()) : 0, y: this.ok() ? sc.sy(this.icorr()) : 0 };
    });

    protected readonly showOp = computed(() => {
        const raw = this.rawOperatingPoint();
        return this.ok() && Number.isFinite(this.icorr()) && this.deltaE() <= this.xMax() && this.icorr() <= this.yMax() && raw.y >= this.pad().t;
    });

    protected readonly opPoint = computed(() => {
        const raw = this.rawOperatingPoint();
        return { x: round1(raw.x), y: round1(raw.y), r: this.dragging() ? 11 : 8 };
    });

    protected readonly guideInfo = computed(() => {
        const g = this.guide();
        if (g == null || !this.ok() || this.dragging()) {
            return { show: false, x: 0, y: 0 };
        }
        const sc = this.scale();
        const gx = Math.min(Math.max(g, 0.01), this.xMax());
        const gy = this.usercurve().fx(gx / 1000) * 1000;
        return { show: Number.isFinite(gy) && gy <= this.yMax(), x: round1(sc.sx(gx)), y: round1(sc.sy(gy)) };
    });

    protected readonly readout = computed(() => {
        if (this.dragging() && this.ok()) {
            return { x: this.deltaE().toFixed(0), y: formatMagnitude(this.icorr()) };
        }
        const g = this.guide();
        if (g == null || !this.ok()) {
            return { x: '—', y: '—' };
        }
        const gx = Math.min(Math.max(g, 0.01), this.xMax());
        const gy = this.usercurve().fx(gx / 1000) * 1000;
        return { x: gx.toFixed(0), y: Number.isFinite(gy) && gy <= this.yMax() ? formatMagnitude(gy) : '—' };
    });

    protected readonly plotCursor = computed(() => (this.dragging() ? 'grabbing' : 'crosshair'));

    constructor() {
        effect((onCleanup) => {
            const el = this.plotBoxRef()?.nativeElement;
            if (!el) {
                return;
            }
            const ro = new ResizeObserver((entries) => {
                if (this.printing()) {
                    return;
                }
                const rect = entries[0].contentRect;
                this.zone.run(() => {
                    this.w.set(Math.round(rect.width));
                    this.h.set(Math.round(rect.height));
                });
            });
            ro.observe(el);
            onCleanup(() => ro.disconnect());
        });

        effect((onCleanup) => {
            const el = this.chartRowRef()?.nativeElement;
            if (!el) {
                return;
            }
            const ro = new ResizeObserver((entries) => {
                if (this.printing()) {
                    return;
                }
                const height = Math.round(entries[0].contentRect.height);
                if (height > 10) {
                    this.zone.run(() => this.rowH.set(height));
                }
            });
            ro.observe(el);
            onCleanup(() => ro.disconnect());
        });

        this.setupPrintHandling();
    }

    protected zoomIn(): void {
        this.zoom(1 / 1.3);
    }

    protected zoomOut(): void {
        this.zoom(1.3);
    }

    protected resetView(): void {
        this.xMax.set(160);
        this.yMax.set(10);
    }

    protected toggleLog(): void {
        this.logOn.update((v) => !v);
    }

    protected toggleRefs(): void {
        this.refsOn.update((v) => !v);
    }

    protected toggleCurve(density: number): void {
        this.hiddenDensities.update((prev) => {
            const next = new Set(prev);
            if (next.has(density)) {
                next.delete(density);
            } else {
                next.add(density);
            }
            return next;
        });
        this.refsOn.set(true);
    }

    protected onWheel(e: WheelEvent): void {
        e.preventDefault();
        this.zoom(e.deltaY > 0 ? 1.15 : 1 / 1.15);
    }

    protected onPointerMove(e: PointerEvent): void {
        const rect = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
        if (this.dragging()) {
            this.applyDrag(e.clientX - rect.left, e.clientY - rect.top);
            return;
        }
        this.guide.set(this.scale().ix(e.clientX - rect.left));
    }

    protected onPointerLeave(): void {
        if (!this.dragging()) {
            this.guide.set(null);
        }
    }

    protected onPointerDown(e: PointerEvent): void {
        if (!this.showOp()) {
            return;
        }
        const rect = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
        const op = this.opPoint();
        const dx = e.clientX - rect.left - op.x;
        const dy = e.clientY - rect.top - op.y;
        if (Math.hypot(dx, dy) > 22) {
            return;
        }
        // The dragging flag must be set before requesting pointer capture: Safari and non-primary
        // pointers can reject setPointerCapture, and the drag has to keep working without it.
        this.dragging.set(true);
        this.guide.set(null);
        try {
            (e.currentTarget as SVGSVGElement).setPointerCapture(e.pointerId);
        } catch {
            /* no capture — drag continues on plain pointermove */
        }
    }

    protected onPointerUp(e: PointerEvent): void {
        if (!this.dragging()) {
            return;
        }
        try {
            (e.currentTarget as SVGSVGElement).releasePointerCapture(e.pointerId);
        } catch {
            /* capture already gone */
        }
        this.dragging.set(false);
    }

    private zoom(factor: number): void {
        this.xMax.update((v) => Math.min(600, Math.max(10, v * factor)));
        this.yMax.update((v) => Math.min(60, Math.max(0.5, v * factor)));
    }

    private applyDrag(px: number, py: number): void {
        const sc = this.scale();
        const ndE = Math.min(Math.max(sc.ix(px), 1), this.xMax());
        const floorIcorr = this.logOn() ? 0.02 : 0.001;
        const nIcorr = Math.min(Math.max(sc.iy(py), floorIcorr), this.yMax());
        const denom = RedoxCalculation.denominator(ndE / 1000);
        const surface = this.usercurve().measuredSurface > 0 ? this.usercurve().measuredSurface : 1;
        const nIapp = nIcorr * denom * surface;
        this.dragMove.emit({
            xoff: Math.max(1, Math.round(this.usercurve().xon - ndE)),
            iapp: Math.min(999, Math.max(0.01, +nIapp.toPrecision(3)))
        });
    }

    private curveForDensity(density: number): RedoxCalculation {
        const known = this.referenceCurves.find((r) => r.spec.density === density);
        return known ? known.curve : new RedoxCalculation(740, 618, density, 1, '');
    }

    /** Polyline for one curve, broken (pen up) wherever the value leaves the plot box. */
    private curvePathFor(curve: RedoxCalculation, sc: ChartScale, steps = 480): string {
        const floor = sc.log ? sc.yMin : 0;
        let d = '';
        let pen = false;
        for (let i = 0; i <= steps; i++) {
            const x = (sc.xMax * i) / steps + sc.xMax / (steps * 40);
            const y = curve.fx(x / 1000) * 1000;
            if (!Number.isFinite(y) || y > sc.yMax || y < floor) {
                pen = false;
                continue;
            }
            const px = sc.sx(x);
            const py = Math.max(sc.top, sc.sy(y));
            d += (pen ? ' L ' : ' M ') + px.toFixed(1) + ' ' + py.toFixed(1);
            pen = true;
        }
        return d.trim();
    }

    private setupPrintHandling(): void {
        let preprintSize: { w: number; h: number } | null = null;

        const before = (): void => {
            preprintSize = { w: this.w(), h: this.h() };
            this.printing.set(true);
            this.w.set(PRINT_PLOT.w);
            this.h.set(PRINT_PLOT.h);
            this.guide.set(null);
            this.dragging.set(false);
        };
        const after = (): void => {
            this.printing.set(false);
            const size = preprintSize ?? { w: 800, h: 460 };
            this.w.set(size.w);
            this.h.set(size.h);
            const el = this.plotBoxRef()?.nativeElement;
            if (el) {
                const rect = el.getBoundingClientRect();
                if (rect.width > 10) {
                    this.w.set(Math.round(rect.width));
                    this.h.set(Math.round(rect.height));
                }
            }
        };
        const beforeHandler = (): void => this.zone.run(before);
        const afterHandler = (): void => this.zone.run(after);

        window.addEventListener('beforeprint', beforeHandler);
        window.addEventListener('afterprint', afterHandler);
        const mq = window.matchMedia ? window.matchMedia('print') : null;
        const mqHandler = (e: MediaQueryListEvent): void => {
            if (e.matches) {
                beforeHandler();
            } else {
                afterHandler();
            }
        };
        mq?.addEventListener('change', mqHandler);

        this.destroyRef.onDestroy(() => {
            window.removeEventListener('beforeprint', beforeHandler);
            window.removeEventListener('afterprint', afterHandler);
            mq?.removeEventListener('change', mqHandler);
        });
    }
}
