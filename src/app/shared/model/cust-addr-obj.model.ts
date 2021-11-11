export class CustAddrObj{
    CustAddrId : number;
    CustId : number;
    MrCustAddrTypeCode : string;
    Addr : string;
    AreaCode1 : string;
    AreaCode2 : string;
    AreaCode3 : string;
    AreaCode4 : string;
    City : string;
    Zipcode : string;
    SubZipcode : string;
    FullAddr : string;
    MrBuildingOwnershipCode : string;
    PhnArea1 : string;
    Phn1 : string;
    PhnExt1 : string;
    PhnArea2 : string;
    Phn2 : string;
    PhnExt2 : string;
    PhnArea3 : string;
    Phn3 : string;
    PhnExt3 : string;
    FaxArea : string;
    Fax : string;
    Notes : string;
    MrHouseOwnershipCode: string;
    RowVersion: string;
    StayLength : number;
    constructor(){this.CustAddrId = 0, this.RowVersion = ""}
}