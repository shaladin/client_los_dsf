import { ProdDObj } from "../../Product/ProdDObj.Model";
import { ProdHObj } from "../../Product/ProdHObj.model";

export class ResGetProductHObj {
    ProdHId : number;
    ProdId : number; 
    ProdCode : string;
    ProdName : string;
    ProdDescr : string;
    ProdStat : string;
    ProdVersion : string;
    StartDt : Date
    EndDt : Date
    RowVersion : string;

    constructor(){
        this.ProdHId = 0;
        this.ProdId = 0;
        this.ProdCode = "";
        this.ProdName = "";
        this.ProdDescr = "";
        this.ProdStat = "";
        this.ProdVersion = "";
        this.StartDt = new Date();
        this.EndDt = new Date();
        this.RowVersion = "";
    }
}

export class ResProdHVersionObj {
    ReturnObject : Array<ProdHObj>

    constructor(){
        this.ReturnObject = new Array<ProdHObj>()
    }
}

export class ResGetProdDCompntInfoObj {
    ReturnObject : ResProdDCompntObj

    constructor(){
        this.ReturnObject = new ResProdDCompntObj();
    }
}

class ResProdDCompntObj
{
    ProdOffComponents : Array<ResProdDObj>

    constructor(){
        this.ProdOffComponents = new Array<ResProdDObj>();
    }
}

export class ResProdDObj {
    GroupCode: string;
    ProdCompntName: string;
    CompntValueDesc: string;
    MrProdBehaviourCode: string;

    constructor(){
        this.GroupCode = "";
        this.ProdCompntName = "";
        this.CompntValueDesc = "";
        this.MrProdBehaviourCode = "";
    }
}