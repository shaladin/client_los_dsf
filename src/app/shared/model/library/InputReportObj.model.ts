import { environment } from "environments/environment";

export class InputReportObj {
    JsonPath: string;
    EnvironmentUrl: string;
    ApiReportPath: string;
    ddlEnvironments: Array<EnviObj>;
    listEnvironments: Array<EnvisObj>;
    
    constructor() {
        this.JsonPath = "",
        this.EnvironmentUrl = environment.FoundationR3Url,
        this.ApiReportPath = "/Report/GenerateReportR3",
        this.ddlEnvironments = new Array<EnviObj>();
        this.listEnvironments = new Array<EnvisObj>();
        this.listEnvironments.push({ environment: "FOU", url: environment.FoundationR3Url });
        this.listEnvironments.push({ environment: "LOS", url: environment.losUrl });
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

export class EnvisObj {
    environment: string;
    url: string;

    constructor() {
        this.environment = "";
        this.url = "";
    }
}