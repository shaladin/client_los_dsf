export class ReqMouCustDsfObj {
    IsNewCalculation: boolean;
    TotalCollateralActive: number;
    DealerEquity: number;
    IsDealerEquityManual: boolean;
    AdjEquity: number;
    NetDealerEquity: number;
    Notes: string;
    DealerGrading: string;
    DealerGradingMultiplier: number;
    Networth: number;
    IsNetworthManual: boolean;
    CeilingCollateral: number;
    IsCeilingCollateralManual: boolean;
    CeilingNetworth: number;
    IsCeilingNetworthManual: boolean;
    MouCustId: number;
    RowVersion: string;

    constructor() { 
        this.IsNewCalculation = false;
        this.TotalCollateralActive = 0;
        this.DealerEquity = 0;
        this.IsDealerEquityManual = false;
        this.AdjEquity = 0;
        this.NetDealerEquity = 0;
        this.Notes = "";
        this.DealerGrading = "";
        this.DealerGradingMultiplier = 0;
        this.Networth = 0;
        this.IsNetworthManual = false;
        this.CeilingCollateral = 0;
        this.IsCeilingCollateralManual = false;
        this.CeilingNetworth = 0;
        this.IsCeilingNetworthManual = false;
        this.MouCustId = 0;
        this.RowVersion = ""}
}