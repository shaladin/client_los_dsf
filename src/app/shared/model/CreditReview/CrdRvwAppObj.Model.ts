import { AdInsConstant } from "app/shared/AdInstConstant";
import { CommonConstant } from "app/shared/constant/CommonConstant";

export class CrdRvwAppObj {

    CrdRvwAppId: number;
    CrdRvwCustInfoId: number;
    AppNo: string;
    NumOfInst: number;
    Tenor: number;
    FirstInstType: string;
    SubjectLifeIns: string;
    CreditScore: string;
    CreditScoreIndicator: string;
    CreditScoreIndicatorDescr: string;
    TcReceived: string;
    InstType: string;
    Ntf: number;
    Ar: number;
    InstAmt: number;
    Dsr: number;
    EffRate: number;
    FlatRate: number;
    GrossYield: number;
    SupplRate: number;
    StdRate: number;
    TotalIncome: number;
    TotalExpense: number;
    Tac: number;
    TacIndicator: string;
    TacIndicatorDescr: string;

    constructor() {
        this.CreditScoreIndicator = CommonConstant.WhiteIndicator;
        this.CreditScoreIndicatorDescr = CommonConstant.NoData;
        this.TacIndicator = CommonConstant.WhiteIndicator;
        this.TacIndicatorDescr = CommonConstant.NoData;
        this.NumOfInst = 0;
        this.Tenor = 0;
        this.Ntf = 0;
        this.Ar = 0;
        this.InstAmt = 0;
        this.Dsr = 0;
        this.EffRate = 0;
        this.FlatRate = 0;
        this.GrossYield = 0;
        this.SupplRate = 0;
        this.StdRate = 0;
        this.TotalIncome = 0;
        this.TotalExpense = 0;
        this.Tac = 0;

    }
}