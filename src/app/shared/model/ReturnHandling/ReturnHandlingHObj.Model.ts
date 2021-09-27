import { environment } from "environments/environment";

export class ReturnHandlingHObj {
  Id: number;
  ReturnHandlingHId: number;
  AppId: number;
  AgrmntId: string;
  ReturnBy: string;
  ReturnDt: Date;
  ReturnNotes: string;
  ReturnFromTrxType: string;
  WfTaskListId: any;
  RowVersion: string;
  IsReturn: boolean;
  IsReturnToSpesific: boolean;

  constructor() {
    this.Id = 0;
    this.ReturnHandlingHId = 0;
    this.AppId = 0;
    this.AgrmntId = "";
    this.ReturnBy = "";
    this.ReturnDt = new Date();
    this.ReturnNotes = "";
    this.ReturnFromTrxType = "";
    this.WfTaskListId = environment.isCore? "" : 0;
    this.RowVersion = "";
    this.IsReturn = false;
    this.IsReturnToSpesific = false;
  }
}
