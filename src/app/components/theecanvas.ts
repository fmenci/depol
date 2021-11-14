import { Component, Input } from '@angular/core';
import { GraduationModel } from 'src/models/graduation.model';
import { RedoxCalculation } from 'src/models/redox.calculation.model';

@Component({
    selector: 'app-theecanvas',
    templateUrl: './theecanvas.html',
    styleUrls: ['./theecanvas.less']
})
export class TheeCanvasComponent {

    @Input() title = '-';
    @Input() set usercurve(value: RedoxCalculation) {
        this.localusercurve = value;
    }
    get usercurve(): RedoxCalculation {
        return this.localusercurve;
    }
    redoxcurves: RedoxCalculation[] = [
        new RedoxCalculation(740, 618, .2, 1, '#f08080'),
        new RedoxCalculation(740, 618, .5, 1, '#0080ff'),
        new RedoxCalculation(740, 618, 1, 1, '#00fbff'),
        new RedoxCalculation(880, 618, 2, 1, '#8080f0'),
        new RedoxCalculation(740, 618, 3, 1, '#80f064'),
        new RedoxCalculation(740, 618, 11, 2, '#ff0000'),
        new RedoxCalculation(740, 618, 6, 1, '#fbff12'),
        new RedoxCalculation(880, 618, 12, 1, '#000000')
    ];
    gradsoffset = 50;
    xmax = 1618;
    xaxis: GraduationModel[] = [];
    yaxis: GraduationModel[] = [];
    ymax = 1000;

    private coefx = 1e4;
    private coefy = 1e5;
    private localusercurve = new RedoxCalculation(740, 618, 6, 1, '#ffff12');

    constructor() {
        let xpos = 0;
        let xcal = this.gradsoffset;
        const xstep = 50 / this.coefx; // mV
        const precx = this.coefx / 10;
        while (xcal < this.xmax) {
            xpos = xpos + xstep;
            xcal = Math.round(this.coefx * xpos) + this.gradsoffset;
            if (xcal < this.xmax) {
                this.xaxis.push(new GraduationModel(Math.round(xpos * 1e3 * precx) / precx, xcal));
            }
        }
        let ypos = 0;
        let ycal = this.gradsoffset;
        const ystep = 50 / this.coefy; // mA/m²
        const precy = this.coefy / 10;
        while (ycal < this.ymax) {
            ypos = ypos + ystep;
            ycal = Math.round(this.coefy * ypos) + this.gradsoffset;
            if (ycal < this.ymax) {
                this.yaxis.push(new GraduationModel(Math.round(ypos * 1e3 * precy) / precy, ycal));
            }
        }
    }

    fetchpath(curve: RedoxCalculation) {
        return curve.drawline(200, this.xmax, this.ymax, this.coefx, this.coefy);
    }

    get xline(): number {
        return this.xmax - this.gradsoffset;
    }

    get xmiddle(): number {
        return Math.round(this.xmax / 2);
    }

    get yline(): number {
        return this.ymax - this.gradsoffset;
    }

    get ymiddle(): number {
        return Math.round(this.ymax / 2);
    }

    // x axis cross hair
    get xxhair(): number {
        return this.localusercurve.deltapotential * this.coefx;
    }

    // y axis cross hair
    get yxhair(): number {
        return (this.ymax - Math.round(this.coefy * this.localusercurve.fx(this.localusercurve.deltapotential)));
    }

}
