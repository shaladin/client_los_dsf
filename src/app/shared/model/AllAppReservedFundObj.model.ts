import { AppReservedFundObj } from "./AppReservedFundObj.model";

export class AllAppReservedFundObj {
  AppId: number;
  RequestAppReservedFundObjs: Array<AppReservedFundObj>;
  RowVersion: string;
  ReturnHandlingHId : number;
  ReturnHandlingExecNotes : string;
  WfTaskIdListId : number;
  IsPersonal: boolean;
  GrossYield: number;
  TotalReservedFundAmt: number;

  constructor() {
    this.AppId = 0;
    this.RowVersion = "";
    this.ReturnHandlingHId = 0;
    this.ReturnHandlingExecNotes = "";
    this.WfTaskIdListId = -999;
    this.IsPersonal = true;
  }
}
