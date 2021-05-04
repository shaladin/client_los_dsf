export class ReqPhoneNumberObj{
    IdSource: number;
    AppId: number;
    Source: string;
    RowVersion: string;
    constructor(){   
        this.IdSource = 0;
        this.AppId = 0;
        this.Source = "";
        this.RowVersion = "";      
    }
}