export class AllAppReservedFundObj {
  AppId: number;
  RequestAppReservedFundObjs: any;
  RowVersion: any;
  ReturnHandlingHId : number;
  ReturnHandlingExecNotes : string;
  WfTaskIdListId : number;
  IsPersonal: boolean;
  GrossYield: any;

  constructor() {
    this.AppId = 0;
    this.RowVersion = "";
    this.ReturnHandlingHId = 0;
    this.ReturnHandlingExecNotes = "";
    this.WfTaskIdListId = -999;
    this.IsPersonal = true;
  }
}
