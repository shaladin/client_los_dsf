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
    ProdOffComponents : ResProdDObj

    constructor(){
        this.ProdOffComponents = new ResProdDObj();
    }
}

class ResProdDObj {
    GroupCode: string;
    GroupName: string;
    Components: Array<ProdDObj>;

    constructor(){
        this.GroupCode = "";
        this.GroupName = "";
        this.Components = new Array<ProdDObj>();
    }
}