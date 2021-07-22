import { KeyValueObj } from "../KeyValue/KeyValueObj.model";

export class ProdOfferingDObj {
    ProdOfferingDId : number;
    ProdOfferingHId : number;
    RefProdCompntGrpCode : string;
    RefProdCompntCode : string;
    CompntValue : string;
    CompntValueDesc : string;
    MrProdBehaviourCode : string;
    DDLRefProdComptCode: Array<KeyValueObj>;
    RowVersion : string;

    constructor(){
        this.ProdOfferingDId = 0;
        this.ProdOfferingHId = 0;
        this.RefProdCompntGrpCode = "";
        this.RefProdCompntCode = "";
        this.CompntValue = "";
        this.CompntValueDesc = "";
        this.MrProdBehaviourCode = "";
        this.DDLRefProdComptCode = new Array();
        this.RowVersion = "";
    }
}