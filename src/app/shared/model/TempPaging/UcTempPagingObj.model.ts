import { CriteriaObj } from "../CriteriaObj.model";

export class UcTempPagingObj {
    urlJson: string;
    enviromentUrl: string;
    apiQryPaging: string;
    pagingJson: string;
    isReady: boolean;
    addCritInput: Array<CriteriaObj>;
    ddlEnvironments: Array<EnviObj>;

    constructor() {
        this.urlJson = "";
        this.enviromentUrl = "";
        this.apiQryPaging = "";
        this.pagingJson = "";
        this.isReady = false;
        this.addCritInput = new Array<CriteriaObj>();
        this.ddlEnvironments = new Array<EnviObj>();
    }
}

export class EnviObj {
    name: string;
    environment: string;

    constructor() {
        this.name = "";
        this.environment = "";
    }
}