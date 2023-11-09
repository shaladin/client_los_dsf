export class ReqAppCommissionHXObj
{
    SkbNo: string;
    SkbStartDt: Date;
    SkbEndDt: Date;

    constructor(){
        this.SkbNo="";
        this.SkbEndDt=new Date();
        this.SkbStartDt = new Date();
    }
}