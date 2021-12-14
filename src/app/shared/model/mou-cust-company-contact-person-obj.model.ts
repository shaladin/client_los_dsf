export class MouCustCompanyContactPersonObj {
    MouCustCompanyContactPersonId: number;
    MouCustCompanyId: number; 
    ContactPersonName: string; 
    MrIdTypeCode: string; 
    IdNo: string; 
    IdExpiredDt : Date;
    BirthPlace: string; 
    BirthDt: Date; 
    MrGenderCode: string;
    MrCustRelationshipCode: string;
    MrJobPositionCode: string;
    JobPositionName: string; 
    JobTitleName: string; 
    MobilePhnNo1: string; 
    MobilePhnNo2: string; 
    Email1: string; 
    Email2: string; 
    Addr: string; 
    AreaCode1: string; 
    AreaCode2: string; 
    AreaCode3: string; 
    AreaCode4: string; 
    City: string; 
    Zipcode: string; 
    PhnArea1: string; 
    Phn1: string; 
    PhnExt1: string; 
    PhnArea2: string; 
    Phn2: string; 
    PhnExt2: string; 
    FaxArea: string; 
    Fax: string; 
    RowVersion: string;
    
    constructor() { 
        this.MouCustCompanyContactPersonId = 0; 
        this.IdExpiredDt = new Date();
        this.RowVersion = "";
    }
}
