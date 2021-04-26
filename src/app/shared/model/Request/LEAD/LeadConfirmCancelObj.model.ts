export class LeadConfirmCancelObj{
    Notes : string;
    LeadStat : string;
    LeadStep : string;
    MrCancelReasonCode : string;
    ListLeadId = new Array();
    ListWfTaskListId = new Array();

    constructor() {
        this.MrCancelReasonCode = "";
    }
}