export class ShareholderPublicXObj {
    CustId: number;
    CustCompanyMgmntShrholderId: number;
    MrPositionSlikCode: string;
    MrPublicTypeCode: string;
    PublicName: string;
    PublicIdentityNo: string;
    PublicAddr: string;
    PublicAreaCode1: string;
    PublicAreaCode2: string;
    PublicAreaCode3: string;
    PublicAreaCode4: string;
    PublicCity: string;
    PublicZipcode: string;
    SharePrcnt: number;
    IsActive: string;
    RowVersion: string;
    constructor() {
        this.CustCompanyMgmntShrholderId = 0;
        this.RowVersion = "";
    }
}