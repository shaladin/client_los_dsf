import { environment } from "environments/environment";

export class ReqMouCustSignerObj{
    MouCustSignerId: number;
    WfTaskListId: any;
    MouCustId: number;
    MfSignerName1: string;
    MfSignerJobPosition1: string;
    MfSignerName2: string;
    MfSignerJobPosition2: string;
    CustSignerName1: string;
    CustSignerJobPosition1: string;
    CustSignerName2: string;
    CustSignerJobPosition2: string;
    RowVersion: string;

    constructor(){
        this.MouCustSignerId = 0;
        this.WfTaskListId = environment.isCore ? "" : 0;
        this.MouCustId = 0;
        this.MfSignerName1 = "";
        this.MfSignerJobPosition1 = "";
        this.MfSignerName2 = "";
        this.MfSignerJobPosition2 = "";
        this.CustSignerName1 = "";
        this.CustSignerJobPosition1 = "";
        this.CustSignerName2 = "";
        this.CustSignerJobPosition2 = "";
        this.RowVersion = "";
    }
}