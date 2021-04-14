import { ProdHObj } from "../../Product/ProdHObj.model";
export class ResGetProductHObj {
    ProdHId : number;
    ProdId : number; 
    ProdCode : string;
    ProdName : string;
    ProdDescr : string;
    StartDt : Date
    EndDt : Date
    ProdVersion : string;
    ProdStat : string;
    RowVersion : string;

    constructor(){
        this.ProdHId = 0;
        this.ProdId = 0;
        this.ProdCode = "";
        this.ProdName = "";
        this.ProdDescr = "";
        this.StartDt = new Date();
        this.EndDt = new Date();
        this.ProdVersion = "";
        this.ProdStat = "";
        this.RowVersion = "";
    }
}

export class ResProdHVersionObj {
    ReturnObject : Array<ResProdHObj>

    constructor(){
        this.ReturnObject = new Array<ResProdHObj>()
    }
}

export class ResProdHObj {
    ProdVersion : string;
    Descr : string;
    StartDt : Date;
    EndDt : Date;

    constructor(){
    this.ProdVersion = "";
    this.Descr = "";
    this.StartDt  = new Date();
    this.EndDt  = new Date();
    }
}
export class ResGetProdDCompntInfoObj {
    ReturnObject : ResProdDCompntInfoObj

    constructor(){
        this.ReturnObject = new ResProdDCompntInfoObj();
    }
}

export class ResProdDCompntInfoObj
{
    ProdOffComponents : Array<ResProdDCompntObj>

    constructor(){
        this.ProdOffComponents = new Array<ResProdDCompntObj>();
    }
}

export class ResProdDCompntObj {
    GroupCode: string;
    GroupName: string;
    Components: Array<ResProdCompntObj>;

    constructor(){
        this.GroupCode = "";
        this.GroupName = "";
        this.Components= new Array<ResProdCompntObj>();
    }
}

class ResProdCompntObj {
    CompntValue: string;
    CompntValueDesc: string;
    MrProdBehaviourCode: string;
    ProdCompntName: string;
    ProdDId: number;
    ProdHId: number;
    RefProdCompntCode: string;
    RefProdCompntGrpCode: string;

    constructor(){
        this.CompntValue= "";
        this.CompntValueDesc= "";
        this.MrProdBehaviourCode= "";
        this.ProdCompntName= "";
        this.ProdDId= 0;
        this.ProdHId= 0;
        this.RefProdCompntCode= "";
        this.RefProdCompntGrpCode= "";
    }
}