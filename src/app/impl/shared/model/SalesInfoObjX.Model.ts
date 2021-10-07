
import { AppDlrFncng } from "app/shared/model/AppData/AppDlrFncng.Model";
import { AppAttrContentObj } from "app/shared/model/AppAttrContent/AppAttrContentObj.Model";

export class SalesInfoObjX {
    AppId: number;
    MouCustId: number;
    MrSalesRecommendCode: string;
    SalesNotes: string;
    SalesOfficerNo: string;
    SalesHeadNo: string;
    MrInstTypeCode: string;
    TopDays: number;
    Tenor: number;
    NumOfInst: number;
    MrInstSchemeCode: string;
    IsDisclosed: boolean;
    PaidBy: string;
    RecourseType: string;
    MrAppSourceCode: string;
    MrWopCode: string;
    PayFreqCode: string;
    MrSingleInstCalcMthdCode: string;
    InterestType: string;
    AppRowVersion: string;
    AppFinDataRowVersion: string;
    AppFctrRowVersion: string;
    RowVersion: string;
    listAppCrossObj: Array<any>;
    AppDlrFncngObj: AppDlrFncng;
    AppAttrContentObjs: Array<AppAttrContentObj>;
    MrSlikSecEcoCode: string;
    constructor() { this.RowVersion = "" }
}