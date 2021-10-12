import { Injectable } from "@angular/core";
import { EnviConfigService } from "../services/enviConfig.service";
import { UrlConstantService } from "../services/urlConstant.service";

@Injectable()

export class UrlConstantNew{

    constructor(public configEnv: EnviConfigService, public urlConfig: UrlConstantService) {
    }
    private env = this.configEnv.getConfig();
    private url = this.urlConfig.getConfig();

    public GetRefOfficeByOfficeCode = this.env.FoundationR3Url + this.url.GetRefOfficeByOfficeCode;
}