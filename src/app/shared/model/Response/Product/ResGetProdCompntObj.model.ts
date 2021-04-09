export class ResGetProductHOComponentGroupedObj {
    ReturnObject : Array<ResListProdHOCompntObj>;

    constructor(){
        this.ReturnObject = new Array<ResListProdHOCompntObj>();
    }

}

class ResListProdHOCompntObj {
    GroupCode: string;
    GroupName: string;
    Components: Array<ResProductCompntWithDetailDomainObj>;

    constructor(){
        this.GroupCode = "";
        this.GroupName = "";
        this.Components = new Array<ResProductCompntWithDetailDomainObj>();
    }
}

class ResProductCompntWithDetailDomainObj {
    RefProdCompntId : number;
    RefProdCompntCode : string;
    ProdCompntName : string;
    SeqNo : number;
    RefProdCompntGrpCode : string;
    IsProdHo : boolean;
    IsProdOffering : boolean;
    IsActive : boolean;
    ProdCompntType : string;
    BehaviourType : string;
    ProdCompntValue : string;
    ProdCompntDtaSrc : string;
    ProdCompntDtaValue : string;
    ProdCompntDtaSrcApi : string;
    LobList : string;
    UserRole : string;
    IsEditable : boolean;
    ProdHId : number;
    ProdDId : number;
    CompntValue : string;
    CompntValueDesc : string;
    MrProdBehaviour : string;

    constructor(){
        this.RefProdCompntId = 0;
        this.RefProdCompntCode = "";
        this.ProdCompntName = "";
        this.SeqNo = 0;
        this.RefProdCompntGrpCode = "";
        this.IsProdHo = false;
        this.IsProdOffering = false;
        this.IsActive = false;
        this.ProdCompntType = "";
        this.BehaviourType = "";
        this.ProdCompntValue = "";
        this.ProdCompntDtaSrc = "";
        this.ProdCompntDtaValue = "";
        this.ProdCompntDtaSrcApi = "";
        this.LobList = "";
        this.UserRole = "";
        this.IsEditable = false;
        this.ProdHId = 0;
        this.ProdDId = 0;
        this.CompntValue = "";
        this.CompntValueDesc = "";
        this.MrProdBehaviour = "";
    }
}