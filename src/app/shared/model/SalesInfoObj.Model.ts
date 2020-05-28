export class SalesInfoObj{
    AppId: number;
    MouCustId: number;
    MrSalesRecommendCode: string;
    SalesNotes:  string;
    SalesOfficerNo:  any;
    SalesHeadNo:  any;
    MrInstTypeCode:  string;
    TopDays:  number;
    Tenor: number;
    NumOfInst: number;
    MrInstSchemeCode:  string;
    IsDisclosed:  any;
    PaidBy: any;
    RecourseType:  string;
    MrAppSourceCode: string;
    MrWopCode:  string;
    PayFreqCode:  string;
    MrSingleInstCalcMthdCode:  string;
    InterestType: string;
    AppRowVersion : any;
    AppFinDataRowVersion : any;
    AppFctrRowVersion : any;
    RowVersion: any;
    constructor(){this.RowVersion = ""}
}