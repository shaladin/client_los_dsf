export class ReqAssetDataObj{
    AgrmntId: number;
    AppId: number;
    SupplCode: string;
    RowVersion: string;
    constructor(){   
        this.AgrmntId = 0;
        this.AppId = 0;
        this.SupplCode = "";
        this.RowVersion = "";     
    }
}