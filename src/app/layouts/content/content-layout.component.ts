import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { StorageService } from 'app/shared/services/StorageService';
import { environment } from 'environments/environment';
import { CookieService } from 'ngx-cookie';

@Component({
    selector: 'app-content-layout',
    templateUrl: './content-layout.component.html',
    styleUrls: ['./content-layout.component.scss']
})

export class ContentLayoutComponent {  
    
    unsubscribe: any;
    token: string = null;
    constructor(public translate: TranslateService, private strService: StorageService, private route: ActivatedRoute, private cookieService: CookieService, private http: HttpClient) {
        const browserLang: string = translate.getBrowserLang();
        this.route.queryParams.subscribe(params => {
            if (params['Token'] != null && params['Token'] != "null") {
                this.token = params['Token'];
                AdInsHelper.SetCookie(this.cookieService, CommonConstant.TOKEN, this.token);
            }
        });

        let langUse: string = 'en';
        this.unsubscribe = this.strService.watch(AdInsConstant.WatchRoleLang).subscribe(
            (response) => {
                console.log(response);
                if (response) {
                    langUse = response;
                    this.translate.use(response);
                }
            }
        );
        translate.use(browserLang.match(/en|id|pt|de/) ? browserLang : langUse);
    }

    ngOnInit() {
        if (AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS) == null && this.token != null) {
            this.LoginWithToken();
        }

        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        // this.unsubscribe = this.strService.watch(AdInsConstant.WatchRoleLang).subscribe(
        //     (response) => {
        //         console.log(response);
        //         if (response) {
        //             this.translate.use(response);
        //         }
        //     }
        // );
    }

    LoginWithToken() {
        this.http.post(AdInsConstant.LoginWithToken, {ModuleCode: environment.Module},  {withCredentials: true}).subscribe(
            (response) => {
                var DateParse = formatDate(response["Identity"].BusinessDt, 'yyyy/MM/dd', 'en-US');
                AdInsHelper.SetCookie(this.cookieService, CommonConstant.TOKEN, response['Token']);
                AdInsHelper.SetCookie(this.cookieService, "BusinessDateRaw", formatDate(response["Identity"].BusinessDt, 'yyyy/MM/dd', 'en-US'));
                AdInsHelper.SetCookie(this.cookieService, "BusinessDate", DateParse);
                AdInsHelper.SetCookie(this.cookieService, "UserAccess", JSON.stringify(response["Identity"]));
                AdInsHelper.SetCookie(this.cookieService, "Username", JSON.stringify(response["Identity"]["UserName"]));
                AdInsHelper.SetLocalStorage(CommonConstant.ENVIRONMENT_MODULE, environment.Module);
        
                this.http.post(AdInsConstant.GetAllActiveRefFormByRoleCodeAndModuleCode, { RoleCode: response["Identity"].RoleCode, ModuleCode: environment.Module }, { withCredentials: true }).subscribe(
                    (response) => {
                        AdInsHelper.SetLocalStorage(CommonConstant.MENU, JSON.stringify(response[CommonConstant.ReturnObj]));
                    });
            }
        );
    }
    
    ChangeLanguage(language: string) {
        localStorage.setItem('lang',language);
        this.strService.set('lang', language);
        this.translate.use(language);
    }

    ngOnDestroy() {
        // this.subEnd.unsubscribe();
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}