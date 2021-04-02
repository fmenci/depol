export class IcorrResultModel{
    constructor(
        public result: number,
        public effect: string,
        public bgcolor: string,
        public bordercolor: string
    ) { }

    get p3(): string{
        return this.result.toPrecision(3);
    }
}
