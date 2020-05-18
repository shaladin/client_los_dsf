import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ContextMenuComponent } from 'ngx-contextmenu';
import { ROUTES } from './sidebar-routes.config';
import { environment } from 'environments/environment';

declare var $: any;

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
})

export class SidebarComponent implements OnInit {
    public menuItems: any[];
    public menu:any[];
    private url:string;
    @ViewChild(ContextMenuComponent) public basicMenu: ContextMenuComponent;

    constructor(private router: Router,
        private route: ActivatedRoute, public translate: TranslateService, private http: HttpClient) {

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
        if(environment.production==false){
            this.menuItems = ROUTES.filter(menuItem => menuItem);
        }
        else
        {
            this.menuItems = JSON.parse(localStorage.getItem("Menu"));
        }
    }

    genParam(params: [{ 'attr': string, 'value': string }]) {
        var arrList = {};

        for (var i = 0; i < params.length; i++) {
            arrList[params[i].attr] = params[i].value;
        }
        return arrList;
    }
    
    //NGX Wizard - skip url change
    ngxWizardFunction(path: string) {
        if (path.indexOf('forms/ngx') != -1)
            this.router.navigate(['forms/ngx/wizard'], { skipLocationChange: false });
    }
}
