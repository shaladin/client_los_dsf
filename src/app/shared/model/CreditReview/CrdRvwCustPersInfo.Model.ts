import { CommonConstant } from "app/shared/constant/CommonConstant";

export class CrdRvwCustPersInfoObj {

    CrdRvwCustPersInfoId: number;
    CrdRvwCustInfoId: number;
    Age: number;
    Education: string;
    LegalAddr: string;
    ResidenceAddr: string;
    HouseOwnership: string;
    HouseOwnershipIndicator: string;
    Occupation: string;
    OccupationIndicator: string;
    MaritalStatus: string;
    Npwp: string;
    NpwpIndicator: string;
    MonthlyIncome: number;
    IsJoinIncome: boolean;
    SpouseName: string;
    SpouseNo: string;
    SpouseIndicator: string;
    HouseOwnershipIndicatorDescr: string;
    OccupationIndicatorDescr: string;
    NpwpIndicatorDescr: string;
    SpouseIndicatorDescr: string;
    SpouseIncome: number;

    constructor() {
        this.CrdRvwCustPersInfoId = 0;
        this.CrdRvwCustInfoId = 0;
        this.Education = "";
        this.LegalAddr = "LegalAddr";
        this.MonthlyIncome = 15000;
        this.SpouseIncome = 0;
        this.IsJoinIncome = true;
        this.HouseOwnershipIndicator = CommonConstant.WhiteIndicator;
        this.HouseOwnershipIndicatorDescr = CommonConstant.NoData;
        this.OccupationIndicator = CommonConstant.WhiteIndicator;
        this.OccupationIndicatorDescr = CommonConstant.NoData;
        this.NpwpIndicator = CommonConstant.WhiteIndicator;
        this.NpwpIndicatorDescr = CommonConstant.NoData;
        this.SpouseIndicator = CommonConstant.WhiteIndicator;
        this.SpouseIndicatorDescr = CommonConstant.NoData;
    }
}