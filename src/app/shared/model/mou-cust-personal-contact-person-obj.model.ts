export class MouCustPersonalContactPersonObj {
    MouCustPersonalContactPersonId: number;
    MouCustPersonalId: number; 
    ContactPersonName: string; 
    MrIdTypeCode: string; 
    IdNo: string; 
    IdExpiredDt : Date;
    BirthPlace: string; 
    BirthDt: Date; 
    MotherMaidenName: string; 
    MrGenderCode: string;
    GenderName: string;
    MrReligionCode: string; 
    MrEducationCode: string; 
    MrJobProfessionCode: string;
    JobProfessionName: string;
    MrMaritalStatCode: string; 
    MrNationalityCode: string; 
    NationalityCountryCode: string; 
    MrCustRelationshipCode: string;
    RelationshipName: string; 
    ContactPersonCustNo: string; 
    IsEmergencyContact: boolean; 
    IsFamily: boolean; 
    MobilePhnNo1: string; 
    MobilePhnNo2: string; 
    Email: string; 
    Addr: string; 
    AreaCode1: string; 
    AreaCode2: string; 
    AreaCode3: string; 
    AreaCode4: string; 
    City: string; 
    Zipcode: string; 
    SubZipcode: string;
    FullAddr: string;
    IsGuarantor: boolean;
    RowVersion: string;
    PhnArea1 : string;
    Phn1 : string;
    PhnExt1 : string;
    PhnArea2 : string;
    Phn2 : string;
    PhnExt2 : string;
    PhnArea3 : string;
    Phn3 : string;
    PhnExt3 : string;
    
    constructor()
    {
      this.MouCustPersonalContactPersonId = 0;
      this.IsGuarantor = false;
      this.IdExpiredDt = new Date();
      this.RowVersion = "";
    }
}
