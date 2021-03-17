export class ReturnHandlingHObj {
    Id: number;
    ReturnHandlingHId: number;
    AppId: number;
    AgrmntId: string;
    ReturnBy: string;
    ReturnDt: Date;
    ReturnNotes: string;
    ReturnFromTrxType: string;
    WfTaskListId: number;
    RowVersion: any;
    IsReturn : boolean;

    constructor() {
        this.RowVersion = ""; 
      this.ReturnHandlingHId = 0;
      this.Id = 0;
    }
}
