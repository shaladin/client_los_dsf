import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ContextMenuComponent } from 'ngx-contextmenu';
import { ROUTES } from './sidebar-routes.config';
import { environment } from 'environments/environment';
import { URLConstant } from '../constant/URLConstant';
import { CommonConstant } from '../constant/CommonConstant';
import { AdInsHelper } from '../AdInsHelper';
import { NavigationConstant } from '../constant/NavigationConstant';

declare var $: any;

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
})

export class SidebarComponent implements OnInit {
    public menuItems: any[];
    public menu: any[];
    private url: string;
    version: string;
    @ViewChild(ContextMenuComponent) public basicMenu: ContextMenuComponent;

    constructor(private router: Router,
        private route: ActivatedRoute, public translate: TranslateService, private http: HttpClient) {
        this.version = localStorage.getItem("Version");

    }

    public getJSON(url: string): Observable<any> {
        return this.http.get(url);
    }

    ngOnInit() {
        $.getScript('./assets/js/app-sidebar.js');
        // this.url = "./assets/menu.json";
        // this.getJSON(this.url).subscribe
        //     (data => {
        //         this.menuItems = data;
        //     }
        //     );
        if (environment.production == false) {
            this.menuItems = ROUTES.filter(menuItem => menuItem);
        }
        else {
            //Update menu if change of environment
            let currEnvi = localStorage.getItem('EnvironmentModule');
            var currentUserContext = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));
            if(currEnvi && currentUserContext && currEnvi != environment.Module)
            {
                var roleObject = {
                    UserName: currentUserContext.UserName,
                    Password: null,
                    OfficeCode: currentUserContext.OfficeCode,
                    RoleCode: currentUserContext.RoleCode,
                    JobTitleCode: currentUserContext.JobTitleCode,
                    RequestDateTime: currentUserContext.BusinessDt,
                    ModuleCode: environment.Module,
                    Ip: "",
                    RowVersion: ""
                };
                var updateRoleUrl = environment.FoundationR3Url + URLConstant.UpdateToken;
                this.http.post(updateRoleUrl, roleObject).subscribe(
                (response) => {
                    localStorage.setItem("Token", response["Token"]);
                    localStorage.setItem("Menu", JSON.stringify(response["Menu"]));
                    localStorage.setItem("EnvironmentModule", environment.Module); 
                    this.menuItems = JSON.parse(localStorage.getItem("Menu"));
                });
            }
            else
                this.menuItems = JSON.parse(localStorage.getItem("Menu"));
        }
    }

    genParam(params: [{ 'Attr': string, 'Value': string }]) {
        var arrList = {};

        for (var i = 0; i < params.length; i++) {
            arrList[params[i].Attr] = params[i].Value;
        }
        return arrList;
    }

    //NGX Wizard - skip url change
    ngxWizardFunction(path: string) {
        if (path.indexOf('forms/ngx') != -1)
            this.router.navigate(['forms/ngx/wizard'], { skipLocationChange: true });
    }

    navigateSkipLocationChange(ev) {
        //sementara Sementara begini dulu, belum ketemu solusi lain
        //problem : ketika di 'click' halaman memasuki halaman /dashboard/dash-board terlebih dahulu
        this.router.navigateByUrl(NavigationConstant.DASHBOARD, { skipLocationChange: true }).then(() => {
            AdInsHelper.RedirectUrl(this.router,[ev.Path],this.genParam(ev.Params));
        });
    }
}
