import { AppInsAddCvgObj } from "./AppInsAddCvgObj.Model";

export class AppInsMainCvgObj {
    AppInsMainCvgId: number;
    AppInsObjId: number;
    MrMainCvgTypeCode: string;
    MainCvgTypeName: string;
    YearNo: number;
    MrInsPaidByCode: string;
    Tenor: number;
    StartDt: Date;
    EndDt: Date;
    IsMainIns: boolean;
    SumInsuredPrcnt: number;
    SumInsuredAmt: number;
    InscoMainPremiRate: number;
    CustMainPremiRate: number;
    InscoMainPremiAmt: number;
    CustMainPremiAmt: number;
    TotalInscoAddPremiAmt: number;
    TotalCustAddPremiAmt: number;
    CustPremiPaidAmt: number;
    TotalCustDiscAmt: number;
    TotalInscoDiscAmt: number;
    AppInsAddCvgObjs: Array<AppInsAddCvgObj>;
    AddCvgTypeName: string;
    IsCapitalized: boolean;
    
constructor() { 
    this.AppInsMainCvgId = 0;
    this.AppInsAddCvgObjs = new Array<AppInsAddCvgObj>();
    }
}
