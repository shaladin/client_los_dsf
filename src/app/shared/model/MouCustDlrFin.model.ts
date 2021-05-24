export class MouCustDlrFinObj {
    MouCustDlrFncngId: number;
    MouCustId: number;
    WopCode: string;
    TopDays: number;
    TopInterestRatePrcnt: number;
    PayFreqCode: string;
    InterestRatePrcnt: number;
    MaximumMonthsForExtend: number;
    MaximumTimesForExtends: number;
    ExtendRatePrcnt: number;
    SpareDayToPay: number;
    AssetCondition: string;
    LcRate: number;
    PrincipalPaidInExtendPrcntg: number;
    ManufacturerCode: string;
    ManufacturerCustNo: string;
    DealerCode: string;
    DealerCustNo: string;
    Notes: string;
    MaximumExtendTimes: number;
    MrInstTypeCode: string;
    VirtualAccNo: string;
    CurrCode: string;
    
    constructor() {
        this.MouCustDlrFncngId = 0;
        this.MouCustId = 0;
        this.WopCode = "";
        this.TopDays = 0;
        this.TopInterestRatePrcnt = 0;
        this.PayFreqCode = "";
        this.InterestRatePrcnt = 0;
        this.MaximumMonthsForExtend = 0;
        this.MaximumTimesForExtends = 0;
        this.ExtendRatePrcnt = 0;
        this.SpareDayToPay = 0;
        this.AssetCondition = "";
        this.LcRate = 0;
        this.PrincipalPaidInExtendPrcntg = 0;
        this.ManufacturerCode = "";
        this.ManufacturerCustNo = "";
        this.DealerCode = "";
        this.DealerCustNo = "";
        this.Notes = "";
        this.MaximumExtendTimes = 0;
        this.MrInstTypeCode = "";
        this.VirtualAccNo = "";
        this.CurrCode = "";
    }
}