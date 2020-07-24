export class AppCustPersonalObj {
    AppCustPersonalId: number;
    AppCustId: number;
    CustFullName: string;
    NickName: string;
    BirthPlace: string;
    BirthDt: Date;
    MotherMaidenName: string;
    MrGenderCode: string;
    MrReligionCode: string;
    MrEducationCode: string;
    MrNationalityCode: string;
    NationalityCountryCode: string;
    MrMaritalStatCode: string;
    MaritalStatName: string;
    FamilyCardNo: string;
    NoOfResidence: number;
    NoOfDependents: number;
    MobilePhnNo1: string;
    MobilePhnNo2: string;
    MobilePhnNo3: string;
    Email1: string;
    Email2: string;
    Email3: string;

constructor() { 
        this.AppCustPersonalId = 0;
        this.AppCustId = 0;
        this.CustFullName = "";
        this.NickName = "";
        this.BirthPlace = "";
        this.MotherMaidenName = "";
        this.MrGenderCode = "";
        this.MrReligionCode = "";
        this.MrEducationCode = "";
        this.MrNationalityCode = "";
        this.NationalityCountryCode = "";
        this.MrMaritalStatCode = "";
        this.FamilyCardNo = "";
        this.NoOfResidence = 0;
        this.NoOfDependents = 0;
        this.MobilePhnNo1 = "";
        this.MobilePhnNo2 = "";
        this.MobilePhnNo3 = "";
        this.Email1 = "";
        this.Email2 = "";
        this.Email3 = "";
    }
}
