export class ResCreditApvResultExtObj{
    CrdApvResultExtId: number;
    AppNo: string;
    AgrmntNo: string;
    CustName : string;
    RemainingDays : number;
    NumberOfExtension : number;
    CrdApvResultExpDt : Date;
    ExtendedCrdApvResultExpDt : Date;
    ExtendBy : string;
    ApprovalDate : Date;

    constructor() {
        this.CrdApvResultExtId = 0;
        this.AppNo = "";
        this.AgrmntNo = "";
        this.CustName = "";
        this.RemainingDays = 0;
        this.NumberOfExtension = 0;
        this.CrdApvResultExpDt = new Date();
        this.ExtendedCrdApvResultExpDt = new Date();
        this.ExtendBy = "";
        this.ApprovalDate = new Date();
    }
}