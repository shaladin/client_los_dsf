import { CriteriaObj } from "./CriteriaObj.model";

export class UcPagingObj {
    _url: string;
    enviromentUrl: string;
    apiQryPaging: string;
    deleteUrl: string;
    pagingJson: string;
    ddlEnvironments: any;
    addCritInput: Array<CriteriaObj>;

    constructor() {
        this.ddlEnvironments = [];
        this.addCritInput = new Array<CriteriaObj>();

    }
}