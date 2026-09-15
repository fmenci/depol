import { IcorrResultModel } from './icorr.result.model';

export class RedoxCalculation {
    // Butler-Volmer slope constants, expressed in volts (60 mV / 120 mV) since fx() takes its
    // depolarisation argument in volts. Shared via denominator() so the chart engine (theecanvas)
    // can invert the curve for drag interactions without duplicating the equation.
    private static readonly BETAA = 0.060;
    private static readonly BETAC = 0.120;
    private epsiloncutoff = 1e-6;
    private noicorrresult = new IcorrResultModel(0, '', 'rgb(233,236,239)', 'rgb(197,209,222)');

    constructor(
        public xon: number, // mV
        public xoff: number, // mV
        public measuredIntensity: number, // mA
        public measuredSurface: number, // m²
        public linecolor: string
    ) { }

    get legend(): string {
        const mam2 = this.measuredIntensity / this.measuredSurface;
        return mam2.toFixed(1) + ' mA/m²';
    }

    get deltapotential(): number {
        return Math.abs(this.xon - this.xoff) / 1e3;
    }

    public icorr(): IcorrResultModel {
        let result: IcorrResultModel;
        if (this.canCalc()) {
            const evalcorrosion = this.fx(Math.abs(this.xon - this.xoff) / 1e3) * 1e3;
            if (evalcorrosion <= 2) {
                result = new IcorrResultModel(evalcorrosion, 'passive', 'rgb(200,255,170)', 'rgb(0,255,0)');
            } else if (evalcorrosion <= 5) {
                result = new IcorrResultModel(evalcorrosion, 'low', 'rgb(253,255,190)', 'rgb(255,255,0)');
            } else if (evalcorrosion <= 10) {
                result = new IcorrResultModel(evalcorrosion, 'moderate', 'rgb(255,211,149)', 'rgb(255,165,0)');
            } else {
                result = new IcorrResultModel(evalcorrosion, 'high', 'rgb(255,170,170)', 'rgb(255,0,0)');
            }
        } else {
            result = this.noicorrresult;
        }
        return result;
    }

    public drawline(steps: number, xmax: number, ymax: number, coefx: number, coefy: number): string {
        if (this.canCalc()) {
            const de = Math.abs(this.xon - this.xoff) / 1e3;
            const passi = de / steps;
            let xpos = passi / 10;
            let pathdata = 'M ' + Math.round(coefx * xpos) + ' ' + (ymax - Math.round(coefy * this.fx(xpos)));
            xpos = 0;
            while (xpos <= (de * 2)) {
                xpos = xpos + passi;
                pathdata = pathdata + ' L ' + Math.round(coefx * xpos) + ' ' + (ymax - Math.round(coefy * this.fx(xpos)));
            }
            return pathdata;
        }
        return 'M 0 0 L ' + xmax + ' ' + ymax + ' ';
    }

    public fx(x: number): number {
        if (this.measuredIntensity <= this.epsiloncutoff) {
            return 0;
        }
        if (this.measuredSurface <= this.epsiloncutoff) {
            return Infinity;
        }
        const denominator = RedoxCalculation.denominator(x);
        if (denominator <= this.epsiloncutoff) {
            if (this.measuredIntensity > 0) {
                return Infinity;
            } else {
                return -Infinity;
            }
        }
        const iapp = this.measuredIntensity / this.measuredSurface;
        return iapp / denominator / 1e3;
    }

    /**
     * Denominator of the Butler-Volmer term at a depolarisation gap (in volts):
     * exp(2.3·ΔE/βc) − exp(−2.3·ΔE/βa). Exposed so the chart engine can invert the curve
     * (icorr, ΔE) → I app when the operator drags the operating point, without restating
     * the equation outside this model.
     */
    public static denominator(deltaPotentialVolts: number): number {
        const de = Math.log(10) * deltaPotentialVolts;
        return Math.exp(de / RedoxCalculation.BETAC) - Math.exp(-de / RedoxCalculation.BETAA);
    }

    private canCalc(): boolean {
        let chk = this.xon > this.epsiloncutoff;
        chk = chk && this.xoff > this.epsiloncutoff;
        chk = chk && this.measuredIntensity > this.epsiloncutoff;
        chk = chk && this.measuredSurface > this.epsiloncutoff;
        return chk;
    }

}
