import { environment } from "environments/environment";
import { NavigationConstant } from "../constant/NavigationConstant";

export class UcViewGenericObj {
    viewInput: string;
    viewEnvironment: string;
    navigationConst: any;
    ddlEnvironments: Array<EnviObj>;
    whereValue: Array<any>;
    listEnvironments: Array<EnvisObj>;

    constructor() {
        this.viewInput = "";
        this.viewEnvironment = environment.losUrl;
        this.ddlEnvironments = new Array<EnviObj>();
        this.listEnvironments = new Array<EnvisObj>();
        this.listEnvironments.push({ environment: "FOUR3WEB", url: environment.FoundationR3Web });
        this.listEnvironments.push({ environment: "LOSR3WEB", url: environment.losR3Web });
        this.whereValue = new Array<any>();
        this.navigationConst = NavigationConstant;
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

export class EnvisObj {
    environment: string;
    url: string;

    constructor() {
        this.environment = "";
        this.url = "";
    }
}

// export class WhereValueObj {
//     property: string;
//     value: any;

//     constructor() {
//         this.property = "";
//     }
// }