export class LeadFraudVerfObj {
    LeadFraudVerfId: number;
    LeadId: number;
    VerifyByCode: string;
    VerifyByName: string;
    VerifyDt: string;
    VerifyStat: string;
    Notes: string;
    RowVersion: string;
    WfTaskListId: number;
    LeadCustData: any;
    IsCustPicked: boolean;
    HasDuplicateCust: boolean;
    constructor() { this.LeadFraudVerfId = 0, this.RowVersion = "" }
}

