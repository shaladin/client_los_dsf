export class CustCompanyMgmntShrholderXObj {
    CustId: number;
    ShareholderId: number;
    MrJobPositionCode: string;
    MrPositionSlikCode: string;
    MrShrholderTypeCode: string;
    RowVersion: string;
    IsActive: boolean;
    IsOwner: boolean;
    IsSigner: boolean;
    SharePrcnt: number;
    EstablishmentDt: Date;
    IsForeigner: boolean;

    constructor() {
        this.CustId = 0;
        this.ShareholderId = 0;
        this.IsActive = false;
        this.IsOwner = false;
        this.IsSigner = false;
        this.IsForeigner = false;
        this.SharePrcnt = 0;
        this.MrJobPositionCode = "";
        this.MrPositionSlikCode = "";
        this.MrShrholderTypeCode = "";
        this.RowVersion = "";
    }
}

export class ResCustCompanyMgmntShrholderObj {
    CustCompanyMgmntShrholderId: number;
    CustId: number;
    ShareholderId: number;
    MrJobPositionCode: string;
    MrPositionSlikCode: string;
    MrShrholderTypeCode: string;
    RowVersion: string;
    IsActive: boolean;
    IsOwner: boolean;
    IsSigner: boolean;
    SharePrcnt: number;
    EstablishmentDt: Date;
    IsForeigner: boolean;

    constructor() {
        this.CustCompanyMgmntShrholderId = 0;
        this.CustId = 0;
        this.IsActive = false;
        this.IsOwner = false;
        this.IsSigner = false;
        this.IsForeigner = false;
        this.SharePrcnt = 0;
        this.MrJobPositionCode = "";
        this.MrPositionSlikCode = "";
        this.MrShrholderTypeCode = "";
        this.RowVersion = "";
    }
}