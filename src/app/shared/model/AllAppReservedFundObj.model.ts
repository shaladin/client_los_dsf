import { environment } from "environments/environment";
import { AppReservedFundObj } from "./AppReservedFundObj.model";

export class AllAppReservedFundObj {
  AppId: number;
  RequestAppReservedFundObjs: Array<AppReservedFundObj>;
  RowVersion: string;
  ReturnHandlingHId : number;
  ReturnHandlingExecNotes : string;
  WfTaskIdListId : any;
  IsPersonal: boolean;
  GrossYield: number;
  TotalReservedFundAmt: number;
  IsReturn: boolean

  constructor() {
    this.AppId = 0;
    this.RowVersion = "";
    this.ReturnHandlingHId = 0;
    this.ReturnHandlingExecNotes = "";
    this.WfTaskIdListId = environment.isCore? "" : -999;
    this.IsPersonal = true;
    this.IsReturn = false;
  }
}
