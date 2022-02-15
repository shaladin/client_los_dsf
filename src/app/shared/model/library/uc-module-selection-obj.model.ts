
import { NavigationConstant } from "app/shared/constant/NavigationConstant";
import { environment } from "environments/environment";

export class UcModuleSelectionObj {
    urlJson: string;
    urlLogo: string;
    listApis: Object;
    target: string;

    constructor() {
        this.urlJson = '';
        this.urlLogo = 'assets/img/logo-01.png';
        this.listApis = new Object();
        this.listApis['FOU_WEB'] = environment.FoundationR3Web + NavigationConstant.PAGES_LOGIN;
        this.listApis['LOS_WEB'] = environment.losR3Web + NavigationConstant.PAGES_LOGIN;
        this.listApis['CMS_WEB'] = environment.cmsR3Web + NavigationConstant.PAGES_LOGIN;
        this.target = '_self';
    }
}

export class UcModuleSelectionConstant {
    public static TOKEN = "XSRF-TOKEN";
}