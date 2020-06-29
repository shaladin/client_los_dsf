import { CriteriaObj } from "./CriteriaObj.model";

export class UcPagingObj {
    _url: string;
    enviromentUrl: string;
    apiQryPaging: string;
    deleteUrl: string;
    pagingJson: string;
    ddlEnvironments: Array<EnviObj>;
    addCritInput: Array<CriteriaObj>;
    whereValue: Array<WhereValueObj>;

    constructor() {
        this.ddlEnvironments = new Array<EnviObj>();
        this.addCritInput = new Array<CriteriaObj>();
        this.whereValue = new Array<WhereValueObj>();
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
export class WhereValueObj {
    property: string;
    value: any;

    constructor() {
        this.property = "";
    }
}