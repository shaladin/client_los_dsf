export class ResRoTelemkOfferSubjectObj{ 

    RoPotentialId: number;
    RoPotentialNo: string;
    BatchNo: string;
    AgrmntNo: string;
    AgrmntMaturityDt: Date;
    CustNo: string;
    CustName: string;
    PhoneNumber: string;
    PhoneType: string;
    DatetimeVerif: Date;
    Result: string;
    ResultName: string;
    Notes: string;
    VerfResultHId: number;
    AgrmntId: number;
    ListPhoneNo: Array<{PhoneNumber:string, PhoneType:string}>;
    
    constructor() {
        this.ListPhoneNo = []
    }
}
