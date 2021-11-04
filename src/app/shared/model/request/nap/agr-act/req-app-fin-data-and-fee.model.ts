export class ReqGetAppFinDataAndFeeObj { 
    AppId : number ;
    ListAppAssetId : Array<number> ;
    IsEnd : boolean ;

    constructor() {
        this.AppId = 0 ;
        this.ListAppAssetId = new Array<number>();
        this.IsEnd = false ;
    }
}