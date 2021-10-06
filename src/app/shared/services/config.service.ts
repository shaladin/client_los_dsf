import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";


@Injectable()

export class ConfigService {
    private appConfig: any;
    constructor(private _http: HttpClient){ }

    loadConfig() {
        return this._http.get('../../assets/appConfig.json')
        .toPromise()
        .then(res => {
            this.appConfig = res;
            console.log('res', res);
        })
    }

    getConfig() {
        return this.appConfig;
    }
}