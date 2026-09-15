// Chart axis geometry for the corrosion evaluation curve — ported from the design bundle's
// redox.js (makeScale, niceTicks, logTicks). Pure coordinate/tick math, independent of the
// electrochemistry: the Tafel/Butler-Volmer equation itself stays in redox.calculation.model.ts.

export interface ChartPadding {
    l: number;
    r: number;
    t: number;
    b: number;
}

export interface ChartScale {
    x0: number;
    y0: number;
    plotW: number;
    plotH: number;
    sx: (v: number) => number;
    ix: (px: number) => number;
    sy: (v: number) => number;
    iy: (py: number) => number;
    top: number;
    log: boolean;
    yMin: number;
    xMax: number;
    yMax: number;
}

export interface MakeScaleOptions {
    w: number;
    h: number;
    pad: ChartPadding;
    xMax: number;
    yMax: number;
    log: boolean;
    yMin?: number;
}

export function makeScale(o: MakeScaleOptions): ChartScale {
    const yMin = o.yMin ?? 0.02;
    const x0 = o.pad.l;
    const y0 = o.h - o.pad.b;
    const plotW = Math.max(10, o.w - o.pad.l - o.pad.r);
    const plotH = Math.max(10, o.h - o.pad.t - o.pad.b);
    const lo = Math.log10(yMin);
    const hi = Math.log10(o.yMax);
    const sx = (v: number) => x0 + (v / o.xMax) * plotW;
    const ix = (px: number) => ((px - x0) / plotW) * o.xMax;
    const sy = o.log
        ? (v: number) => y0 - ((Math.log10(Math.max(v, yMin / 20)) - lo) / (hi - lo)) * plotH
        : (v: number) => y0 - (v / o.yMax) * plotH;
    const iy = o.log
        ? (py: number) => Math.pow(10, lo + ((y0 - py) / plotH) * (hi - lo))
        : (py: number) => ((y0 - py) / plotH) * o.yMax;
    return { x0, y0, plotW, plotH, sx, ix, sy, iy, top: o.pad.t, log: o.log, yMin, xMax: o.xMax, yMax: o.yMax };
}

export function niceTicks(max: number, target: number): { step: number; ticks: number[] } {
    const raw = max / Math.max(2, target);
    const mag = Math.pow(10, Math.floor(Math.log10(raw)));
    const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw) || mag * 10;
    const out: number[] = [];
    for (let v = 0; v <= max + step * 0.001; v += step) {
        out.push(Math.round(v * 1e6) / 1e6);
    }
    return { step, ticks: out };
}

export function logTicks(min: number, max: number): number[] {
    const out: number[] = [];
    for (let e = Math.floor(Math.log10(min)); e <= Math.ceil(Math.log10(max)); e++) {
        for (const m of [1, 2, 5]) {
            const v = m * Math.pow(10, e);
            if (v >= min * 0.999 && v <= max * 1.001) {
                out.push(v);
            }
        }
    }
    return out;
}

/** `Infinity`-safe, precision-capped display formatting shared by the chart readout and the verdict card. */
export function formatMagnitude(n: number, precision = 3): string {
    if (!Number.isFinite(n)) {
        return '—';
    }
    return Math.abs(n) >= 100 ? n.toFixed(0) : n.toPrecision(precision);
}
