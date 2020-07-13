
export class UcViewGenericObj {
    viewInput: string;
    viewEnvironment: string;
    ddlEnvironments: Array<EnviObj>;
    whereValue: Array<WhereValueObj>;

    constructor() {
        this.viewInput = "";
        this.viewEnvironment = "";
        this.ddlEnvironments = new Array<EnviObj>();
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