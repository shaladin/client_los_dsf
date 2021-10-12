import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";


@Injectable()

export class UrlConstantService {
    private urlConstant: any;
    constructor(private _http: HttpClient){ }

    loadConfig() {
        return this._http.get('../../assets/urlConstant.json')
        .toPromise()
        .then(res => {
            this.urlConstant = res;
        });
    }

    getConfig() {
        return this.urlConstant;
    }
}