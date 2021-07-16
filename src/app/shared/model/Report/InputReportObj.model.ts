export class InputReportObj {
    JsonPath: string;
    EnvironmentUrl: string;
    ApiReportPath: string;
    ddlEnvironments: Array<EnviObj>;
    
    constructor() {
        this.JsonPath = "",
        this.EnvironmentUrl = "",
        this.ApiReportPath = "/Report/GenerateReportSync",
        this.ddlEnvironments = new Array<EnviObj>();
    }
}

export class EnviObj {
    name: string;
    environment: string;
    
    constructor() {
        this.name = "",
        this.environment = ""
    }
}