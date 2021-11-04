export class ResThirdPartyRsltHObj {
    ThirdPartyRsltHId : number;
    ReqDt : Date;
    ReqJson : string;

    constructor(){
        this.ThirdPartyRsltHId = 0;
        this.ReqDt = new Date();
        this.ReqJson = "";
    }
}