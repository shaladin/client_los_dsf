
export class CustDataObj {
    AppId: number;
    AppCustId: number;
    IsCustomer: boolean;
    IsFamily: boolean;
    IsGuarantor: boolean;
    IsShareholder: boolean;
    RowVersion: string;

    constructor() { 
        this.RowVersion = ""; 
    }
}
