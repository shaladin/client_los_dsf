export class AppCustAddrObj {
    AppCustAddrId: number;
    AppCustId: number;
    MrCustAddrTypeCode: string;
    MrHouseOwnershipCode: string;
    Addr: string;
    AreaCode1: string;
    AreaCode2: string;
    AreaCode3: string;
    AreaCode4: string;
    City: string;
    Zipcode: string;
    SubZipcode: string;
    PhnArea1: string;
    Phn1: string;
    PhnExt1: string;
    PhnArea2: string;
    Phn2: string;
    PhnExt2: string;
    FaxArea: string;
    Fax: string;
    FullAddr: string;
    StayLength: number;
    RowVersion: any;

    constructor() { this.AppCustAddrId = 0; }
}
