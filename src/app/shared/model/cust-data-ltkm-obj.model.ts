export class CustDataLtkmObj {
    AppId: number;
    LtkmCustId: number;
    IsCustomer: boolean;
    IsFamily: boolean;
    IsGuarantor: boolean;
    IsShareholder: boolean;
    RowVersion: string;

    constructor() { 
        this.RowVersion = ""; 
    }
}
