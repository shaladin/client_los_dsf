import { environment } from "environments/environment";
import { ReqAppReservedFundXObj } from "./ReqAppReservedFundXObj.model";


export class AllAppReservedFundXObj {
  RequestAppReservedFundObjs: Array<ReqAppReservedFundXObj>;
  GrossYield: number;
  TotalReservedFundAmt: number;
  IsReturn: boolean;
  WfTaskIdListId : any;

  constructor() {
    this.IsReturn = false;
    this.WfTaskIdListId = environment.isCore? "" : -999;
  }
}
