export class CustGrpPlfndReqDsfObj
{
    CustGrpPlfndDsfId: any;
    CustGrpNo: string;
    PropPlafondMax: any;
    PropDtmStart: any;
    PropDtmEnd: any;
    RequestRFAObj: any;

    constructor()
    {
        this.CustGrpPlfndDsfId = "";
        this.CustGrpNo = "";
        this.PropPlafondMax = 0;
        this.PropDtmStart = Date.now;
        this.PropDtmEnd = Date.now;
    }
}