import { Component, AfterViewChecked, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RolePickService } from 'app/shared/rolepick/rolepick.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { formatDate } from '@angular/common';
import { NotificationHObj } from '../model/notification-h/notification-h-obj.model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { URLConstant } from '../constant/URLConstant';
import { CommonConstant } from '../constant/CommonConstant';
import { NavigationConstant } from '../constant/NavigationConstant';
import { CookieService } from 'ngx-cookie';
import { AdInsConstant } from '../AdInstConstant';
import { RolePickNewService } from '../rolepick/rolepick-new.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    providers: [NGXToastrService]
})

export class NavbarComponent implements AfterViewChecked, OnInit {
    currentLang = 'en';
    toggleClass = 'ft-maximize';
    placement = 'bottom-right'
    displayName: string;
    userId: string;
    roleName: string;
    officeName: string;
    businessDate: string;
    public isCollapsed = true;
    token: string;
    userAccess: any;
    backgroundColor = environment.navbarColor;
    NotificationHListObj = new Array<NotificationHObj>();
    TotalUnread: number = 0;

    notifications: object[] = [];
    readonly ChangeLink: string = NavigationConstant.PAGES_CHANGE_PASSWORD;
    constructor(public translate: TranslateService,
        private router: Router, private cookieService: CookieService,
        private http: HttpClient, public rolePickService: RolePickService, private rolePickNewService: RolePickNewService) {
        const browserLang: string = translate.getBrowserLang();
        translate.use(browserLang.match(/en|id|pt|de/) ? browserLang : 'en');
    }

    ngOnInit() {
        // this.GetListNotifH();
        localStorage.setItem('lang', 'en');
        
        this.setUser();
    }

    setUser(){
        this.userAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
        let businessDate = AdInsHelper.GetCookie(this.cookieService, CommonConstant.BUSINESS_DATE);
        let date = new Date(businessDate.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"));
        businessDate = formatDate(date, 'dd-MMM-yyyy', 'en-US');
        this.businessDate = businessDate;
    }

    // GetListNotifH() {
    //     this.http.post(URLConstant.GetListNotificationHByRefUserId, { isLoading: false }).subscribe(
    //         (response) => {
    //             this.TotalUnread = response["TotalUnreadNotification"];
    //             this.NotificationHListObj = response["ResponseNotificationHCustomObjs"];
    //         });
    // }

    InitNotification() {

    }

    ngAfterViewChecked() {
    }

    ClickNotification(item) {
        this.http.post(URLConstant.UpdateReadNotification, { Id: item.NotificationDId }).subscribe(
            () => {
            });
        if (item.MrNotificationMethodCode == "EXT_LINK") {
            window.open(item.Url, "_blank");
        }
        else if (item.MrNotificationMethodCode = "INT_LINK") {
            window.open(item.Url);
        }
    }

    logout() {
        this.http.post(AdInsConstant.Logout, "");
        AdInsHelper.ClearAllLog(this.cookieService);
        this.cookieService.removeAll();
        AdInsHelper.RedirectUrl(this.router, [NavigationConstant.PAGES_LOGIN], {});
    }

    ShowRole() {
        var data = { status: "200", reason: "OK" };

        let isUseNewRolepick: string = AdInsHelper.GetLocalStorage(CommonConstant.IS_USE_NEW_ROLEPICK);
        if(isUseNewRolepick == '0'){
            this.rolePickService.openDialog(data, "modal");
        }
        else {
            this.rolePickNewService.openDialog(data, "modal");
        }
    }


    ChangeLanguage(language: string) {
        localStorage.setItem('lang', language);
        this.translate.use(language);
    }

    
    changeModul(modul: string) {
        if(modul == 'cm') {
            this.router.navigate([NavigationConstant.PAGES_MODULE_SELECTION]);
        }
        else {
            var token = AdInsHelper.GetCookie(this.cookieService, CommonConstant.TOKEN);
            var url = environment.losR3Web + NavigationConstant.PAGES_LOGIN + "?token=" + token;
            window.open(url, "_blank");
        }
        
    }

    ToggleClass() {
        if (this.toggleClass == 'ft-maximize') {
            this.toggleClass = 'ft-minimize';
        }
        else
            this.toggleClass = 'ft-maximize'
    }
}
