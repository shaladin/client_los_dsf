export class ResCreditApvResultExtObj{
    AppNo: string;
    AgrmntNo: string;
    CustName : string;
    RemainingDays : number;
    NumberOfExtension : number;
    CrdApvResultExpDt : Date;
    ExtendedCrdApvResultExpDt : Date;

    constructor() {
        this.AppNo = "";
        this.AgrmntNo = "";
        this.CustName = "";
        this.RemainingDays = 0;
        this.NumberOfExtension = 0;
        this.CrdApvResultExpDt = new Date();
        this.ExtendedCrdApvResultExpDt = new Date();
    }
}