import { LtkmCustAddrObj } from "./LtkmCustAddrObj.Model";

export class LtkmCustCompanyContactPersonObj {
    LtkmCustId: number;
    LtkmCustCompanyContactPersonId: number;
    LtkmCustCompanyId: number;
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
    IdExpiredDt: Date;
    BirthPlace: string;
    BirthDt: string;
    LtkmCustAddrObj: LtkmCustAddrObj;
    RowVersion: string;

    constructor() {
        this.LtkmCustCompanyId = 0;
        this.LtkmCustCompanyContactPersonId = 0;
        this.RowVersion = "";
    }
}
