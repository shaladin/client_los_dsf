
export class CustPersonalContactPersonObj {
     CustPersonalContactPersonId: number;
     CustId: number;
     ContactPersonName: string; 
     MrIdTypeCode: string; 
     IdNo: string; 
     BirthPlace: string; 
     BirthDt: Date; 
     MotherMaidenName: string; 
     MrGenderCode: string; 
     MrReligionCode: string; 
     MrEducationCode: string; 
     MrJobProfessionCode: string; 
     MrMaritalStatCode: string; 
     MrNationalityCode: string; 
     NationalityCountryCode: string; 
     MrCustRelationshipCode: string; 
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
     Phn1: string; 
     Phn2: string; 
     Phn3: string; 
     PhnArea1: string; 
     PhnArea2: string; 
     PhnArea3: string; 
     PhnExt1: string; 
     PhnExt2: string; 
     PhnExt3: string; 
     City: string; 
     Zipcode: string; 
     SubZipcode: string; 
     ContactPersonCustNo: string; 
     IdExpiredDt: Date; 
     TaxIdNo: string;

     constructor() { 
        this.CustPersonalContactPersonId = 0;
        this.CustId = 0;
        this.ContactPersonName = ""; 
        this.MrIdTypeCode = ""; 
        this.IdNo = ""; 
        this.BirthPlace = ""; 
        this.BirthDt = new Date(); 
        this.MotherMaidenName = ""; 
        this.MrGenderCode = ""; 
        this.MrReligionCode = ""; 
        this.MrEducationCode = ""; 
        this.MrJobProfessionCode = ""; 
        this.MrMaritalStatCode = ""; 
        this.MrNationalityCode = ""; 
        this.NationalityCountryCode = ""; 
        this.MrCustRelationshipCode = ""; 
        this.IsEmergencyContact = false; 
        this.IsFamily = false; 
        this.MobilePhnNo1 = ""; 
        this.MobilePhnNo2 = ""; 
        this.Email = ""; 
        this.Addr = ""; 
        this.AreaCode1 = ""; 
        this.AreaCode2 = ""; 
        this.AreaCode3 = ""; 
        this.AreaCode4 = ""; 
        this.Phn1 = ""; 
        this.Phn2 = ""; 
        this.Phn3 = ""; 
        this.PhnArea1 = ""; 
        this.PhnArea2 = ""; 
        this.PhnArea3 = ""; 
        this.PhnExt1 = ""; 
        this.PhnExt2 = ""; 
        this.PhnExt3 = ""; 
        this.City = ""; 
        this.Zipcode = ""; 
        this.SubZipcode = ""; 
        this.ContactPersonCustNo = ""; 
        this.IdExpiredDt = new Date(); 
        this.TaxIdNo = "";
    }
}
