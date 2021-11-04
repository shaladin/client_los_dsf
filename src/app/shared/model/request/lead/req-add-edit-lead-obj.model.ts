export class ReqAddLeadObj{
    LeadCopyId: number;
    OriOfficeCode: string;
    CrtOfficeCode: string;
    LeadDt: Date;
    OrderNo: string;
    LobCode: string;
    MrLeadSourceCode: string;
    LeadStat: string;
    LeadStep: string;
    TeleMarketingUsername: string;
    CmoUsername: string;
    SurveyorUsername: string;
    AgencyCode: string;
    DuplicateLeadId: number;
    SrvyOrderNo: number;
    IsSubmit: boolean;
    RowVersion: string;

    constructor() {
        this.OriOfficeCode = "";
        this.CrtOfficeCode = "";
        this.LeadDt = new Date();
        this.OrderNo = "";
        this.LobCode = "";
        this.MrLeadSourceCode = "";
        this.LeadStat = "";
        this.LeadStep = "";
        this.TeleMarketingUsername = "";
        this.AgencyCode = "";
        this.IsSubmit = false;
        this.RowVersion = "";
    }
}

export class ReqEditLeadObj extends ReqAddLeadObj{
    LeadId: number;
    
    constructor() {
        super();
        this.LeadId = 0;
    }
}