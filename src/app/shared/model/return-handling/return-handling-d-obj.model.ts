import { environment } from "environments/environment";

export class ReturnHandlingDObj {
  ReturnHandlingDId: number;
  ReturnHandlingHId: number;
  MrReturnTaskCode: string;
  ReturnTaskName: string;
  ReturnStat: string;
  ReturnStatName: string;
  ReturnHandlingNotes: string;
  ReturnHandlingExecNotes: string;
  WfTaskListId: any;
  AppId: number;
  RowVersion: string;

  constructor() {
    this.ReturnHandlingDId = 0;
    this.ReturnHandlingHId = 0;
    this.MrReturnTaskCode = "";
    this.ReturnTaskName = "";
    this.ReturnStat = "";
    this.ReturnStatName = "";
    this.ReturnHandlingNotes = "";
    this.ReturnHandlingExecNotes = "";
    this.WfTaskListId = environment.isCore? "" : 0;
    this.AppId = 0;
    this.RowVersion = "";
  }
}
