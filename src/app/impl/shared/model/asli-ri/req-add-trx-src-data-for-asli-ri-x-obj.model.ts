export class ReqAddTrxSrcDataForAsliRIXObj{ 
    CustNo: string;
    CustName: string;
    CustType: string;
    IdNo: string;
    Nik: string;
    Phone: string;
    Address: string;
    BirthDt: Date;
    BirthPlace: string;
    CompanyName: string;
    CompanyPhone: string;
    NpwpPersonal: string;
    MonthlyIncome: number;
    NpwpCompany: string;
    AnnualRevenue: number;
    SelfiePhoto: string;
    ListReqVerificationType: Array<string>;

    constructor(){
        this.CustNo = "";
        this.CustName = "";
        this.IdNo = "";
        this.Nik = "";
        this.Phone = "";
        this.Address = "";
        this.BirthDt = new Date();
        this.BirthPlace = "";
        this.CompanyName = "";
        this.CompanyPhone = "";
        this.NpwpPersonal = "";
        this.MonthlyIncome = 0;
        this.NpwpCompany = "";
        this.AnnualRevenue = 0;
        this.SelfiePhoto = "";
        this.ListReqVerificationType = new Array;
    }
}