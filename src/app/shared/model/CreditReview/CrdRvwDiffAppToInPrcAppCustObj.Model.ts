export class CrdRvwDiffAppToInPrcAppCustObj{
    
    CrdRvwDiffAppToInPrcAppCustId: number;
    CrdRvwCustInfoId: number;
    FieldName: string;
    AppNo: string;
    AppValue: string;
    IsRvwApp: boolean;
    IsDifference: boolean;
    RowVersion: string;
    constructor(){
        this.IsRvwApp = false;
        this.IsDifference = false;

    }
}