export class ProdDObj {
    ProdDId: number;
    ProdHId: number;
    RefProdCompntGrpCode: string;
    RefProdCompntCode: string;
    CompntValue: string;
    CompntValueDesc: string;
    MrProdBehaviourCode: string;
    RowVersion: string;

    constructor() {
        this.ProdDId = 0;
        this.ProdHId = 0;
        this.RefProdCompntGrpCode = "";
        this.RefProdCompntCode = "";
        this.CompntValue = "";
        this.CompntValueDesc = "";
        this.MrProdBehaviourCode = "";
        this.RowVersion = "";
    }
}
