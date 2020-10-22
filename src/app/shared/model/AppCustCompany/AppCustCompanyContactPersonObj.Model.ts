import { AppCustAddrObj } from "../AppCustAddrObj.Model";

export class AppCustCompanyContactPersonObj {
    AppCustId: number;
    AppCustCompanyContactPersonId: number;
    AppCustCompanyId: number;
    ContactPersonName: string;
    MrJobPositionCode: string;
    JobTitleName: string;
    MobilePhnNo1: string;
    MobilePhnNo2: string;
    Email1: string;
    Email2: string;
    PhnArea1: string;
    Phn1: string;
    PhnExt1: string;
    PhnArea2: string;
    Phn2: string;
    PhnExt2: string;
    MrGenderCode: string;
    MrCustRelationshipCode: string;
    MrIdTypeCode: string;
    IdNo: string;
    IdExpiredDt: any;
    BirthPlace: string;
    BirthDt: string;
    AppCustAddrObj: AppCustAddrObj;
    RowVersion: string;

    constructor() { 
        this.AppCustCompanyId = 0;
        this.AppCustCompanyContactPersonId = 0; 
        this.RowVersion = "";
    }
}
