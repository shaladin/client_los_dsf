export class ReqGetListActiveVendorEmpByVendorIdAndPositionCodeObj{
    VendorId: number;
    MrVendorEmpPositionCodes: Array<string>;
    RowVersion: string;
    constructor(){   
        this.VendorId = 0;
        this.MrVendorEmpPositionCodes = new Array<string>();
        this.RowVersion = "";     
    }
}

export class ReqGetListBankByVendorEmpNoAndCodeObj{
    VendorEmpNo: string;
    VendorCode: string;
    RowVersion: string;
    constructor(){   
        this.VendorEmpNo = "";
        this.VendorCode = "";
        this.RowVersion = "";     
    }
}