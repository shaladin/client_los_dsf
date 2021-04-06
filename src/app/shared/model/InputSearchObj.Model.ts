import { CriteriaObj } from "./CriteriaObj.model";

export class InputSearchObj {
    _url: string;
    enviromentUrl: string;
    title: string;
    apiQryPaging: string;
    arrCritObj: any;
    addCritInput: Array<CriteriaObj>;
    ddlEnvironments: Array<EnviObj>;
    whereValue: Array<WhereValueObj>;
    switchValue: Array<SwitchValueObj>;
    
    constructor() {
        this._url = "";
        this.enviromentUrl = "";
        this.title = "";
        this.apiQryPaging = "";
        this.arrCritObj = null;
        this.addCritInput = new Array<CriteriaObj>();
        this.ddlEnvironments = new Array<EnviObj>();
        this.whereValue = new Array<WhereValueObj>();
        this.switchValue = new Array<SwitchValueObj>();
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

export class SwitchValueObj {
    property: string;
    value: any;

    constructor() {
        this.property = "";
    }
}