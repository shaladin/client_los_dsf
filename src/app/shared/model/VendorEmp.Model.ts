export class VendorEmpObj{
    VendorEmpId: number;
    VendorId: number;
    SupervisorId: number;
    VendorEmpNo: string;
    VendorEmpName: string;
    MobilePhnNo1: string;
    MobilePhnNo2: string;
    Email: string;
    MrIdTypeCode: string;
    IdNo: string;
    BirthPlace: string;
    BirthDate: Date;
    IsActive: boolean;
    JoinDt: Date;
    TaxIdNo: string;
    TaxpayerName: string;
    MrVendorEmpPositionCode: string;
    IsContactPerson: boolean;
    VendorEmpRating: number;
    IsOwner: boolean;
    RowVersion: string;
    constructor() { this.VendorEmpId = 0; }
}