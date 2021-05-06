export class ResGetVendorEmpByVendorIdAndEmpNoObj{
    VendorEmpId: number;
    RowVersion: string;
    constructor(){   
        this.VendorEmpId = 0;
        this.RowVersion = "";     
    }
}

export class ResGetVendorEmpSpvByEmpNoObj{
    VendorEmpNo: string;
    VendorEmpName: string;
    MrVendorEmpPositionCode : string;
    RowVersion: string;
    constructor(){   
        this.VendorEmpNo = "";
        this.VendorEmpName = "";
        this.MrVendorEmpPositionCode = "";
        this.RowVersion = "";     
    }
}