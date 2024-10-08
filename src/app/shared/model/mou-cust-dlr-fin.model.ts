export class MouCustDlrFinObj {
    MouCustDlrFncngId: number;
    MouCustId: number;
    WopCode: string;
    WopCodeDesc: string;
    TopDays: number;
    TopInterestRatePrcnt: number;
    PayFreqCode: string;
    InterestRatePrcnt: number;
    MaximumMonthsForExtend: number;
    MaximumMonthForExtend: number;
    MaximumTimesForExtends: number;
    ExtendRatePrcnt: number;
    SpareDayToPay: number;
    AssetCondition: string;
    LcRate: number;
    PrincipalPaidInExtendPrcntg: number;
    ManufacturerCode: string;
    ManufacturerName: string;
    ManufacturerCustNo: string;
    ManufacturerCustName: string;
    DealerCode: string;
    DealerName: string;
    DealerCustNo: string;
    DealerCustName: string;
    Notes: string;
    MaximumExtendTimes: number;
    MrInstTypeCode: string;
    VirtualAccNo: string;
    CurrCode: string;
    RevolvingType: string;
    RevolvingTypeDesc: string;
    ChangeMouTrxId: number;
    MaxExtendRate: number;
    InterestCalcBased: string; 

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
        this.ChangeMouTrxId = 0;
        this.InterestCalcBased = ""; 
    }
}