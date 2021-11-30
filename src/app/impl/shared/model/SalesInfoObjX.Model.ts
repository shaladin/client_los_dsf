import { AppDlrFncng } from "app/shared/model/app-data/app-dlr-fncng.model";
import { AppAttrContentObj } from "app/shared/model/app-attr-content/app-attr-content-obj.model";


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