import { environment } from "environments/environment";

export class InputReportObj {
    JsonPath: string;
    EnvironmentUrl: string;
    ApiReportPath: string;
    ddlEnvironments: Array<EnviObj>;
    
    constructor() {
        this.JsonPath = "",
        this.EnvironmentUrl = environment.FoundationR3Url,
        this.ApiReportPath = "/Report/GenerateReportR3",
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