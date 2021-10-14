import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";


@Injectable()

export class EnviConfigService {
    private appConfig: any;
    constructor(private _http: HttpClient){ }

    loadConfig() {
        return this._http.get('../../assets/enviConfig.json')
        .toPromise()
        .then(res => {
            this.appConfig = res;
        });
    }

    getConfig() {
        return this.appConfig;
    }
}