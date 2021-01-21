import { AgrmntLifeInsD } from "./AgrmntLifeInsD.Model";

export class AgrmntLifeInsObj {
    AgrmntId: number;
    AgrmntLifeInsHId: number;
    BaseRate: number;
    CoverageAmt: number;
    CustAdminFeeAmt: number;
    IsCapitalized: boolean;
    IsCustCover: boolean;
    IsGuarantorCover: boolean;
    IsSpouseCover: boolean;
    LifeInscoAdminFeeAmt: number;
    LifeInscoBrnchCode: number;
    LifeInscoBrnchName: number;
    ListAgrmntLifeInsD: Array<AgrmntLifeInsD>;
    MrLifeInsPaidMethodCode: string;
    NettRate: number;
    NewCoverInputDt: Date;
    NewCoverNotes: number;
    PaidInAdvPrcnt: number;
    RowVersion: string;
    SellingRate: number;
    TotalLifeInsCptlzAmt: number;
    TotalLifeInsIncomeAmt: number;
    TotalPremiFromInsco: number;
    TotalPremiToCust: number;
    constructor() {
        this.ListAgrmntLifeInsD = new Array<AgrmntLifeInsD>();
    }
}