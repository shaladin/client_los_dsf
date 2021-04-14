import { environment } from "environments/environment";
import { NavigationConstant } from "../constant/NavigationConstant";

export class UcViewGenericObj {
    viewInput: string;
    viewEnvironment: string;
    navigationConst: any;
    ddlEnvironments: Array<EnviObj>;
    whereValue: Array<any>;

    constructor() {
        this.viewInput = "";
        this.viewEnvironment = environment.losUrl;
        this.ddlEnvironments = new Array<EnviObj>();
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

// export class WhereValueObj {
//     property: string;
//     value: any;

//     constructor() {
//         this.property = "";
//     }
// }