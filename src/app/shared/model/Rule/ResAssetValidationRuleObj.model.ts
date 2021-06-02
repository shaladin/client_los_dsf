export class ResAssetValidationRuleObj {
    MinManufYear: number;
    Behaviour: string;
    DPPrcnt: number;
    DPBhv: string;
    DPMin: number;
    DPMax: number;

    constructor() {
        this.MinManufYear = 0;
        this.Behaviour = "";
        this.DPPrcnt = 0;
        this.DPBhv = "";
        this.DPMin = 0;
        this.DPMax = 0;
    }
}