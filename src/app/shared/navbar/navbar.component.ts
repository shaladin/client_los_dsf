import { Component, AfterViewChecked, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RolePickService } from 'app/shared/rolepick/rolepick.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { Router } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { formatDate } from '@angular/common';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { NotificationHObj } from '../model/NotificationH/NotificationHObj.model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { URLConstant } from '../constant/URLConstant';
import { CommonConstant } from '../constant/CommonConstant';
import { NavigationConstant } from '../constant/NavigationConstant';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    providers: [RolePickService, NGXToastrService]
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

    constructor(public translate: TranslateService,
        private router: Router,
        private http: HttpClient, public rolePickService: RolePickService, private toastr: NGXToastrService) {
        const browserLang: string = translate.getBrowserLang();
        translate.use(browserLang.match(/en|id|pt|de/) ? browserLang : 'en');
        var userAccess = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));
        var businessDate = localStorage.getItem("BusinessDate");
        var date = new Date(businessDate.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"));
        businessDate = formatDate(date, 'dd-MMM-yyyy', 'en-US');
        this.businessDate = businessDate;
        // this.userId = userAccess.userId;
        this.userAccess = userAccess;
        //this.displayName = userAccess.userId + ", " + userAccess.roleName + " - " + userAccess.officeName + " - " + businessDate;
    }

    ngOnInit() {
        this.GetListNotifH();
        // Object.defineProperty(WebSocket, 'OPEN', { value: 1, });

        // var _hubConnection = new HubConnectionBuilder()
        //     .withUrl(URLConstant.WebSocketUrl)
        //     //.withUrl("Http://localhost:5000/Notificationhub")
        //     .withAutomaticReconnect()
        //     .build();

        // _hubConnection.start()
        //     .then(() => console.log("Connection Started !"))
        //     .then(() => _hubConnection.invoke("SubscribeNotification", this.userAccess.UserName, this.userAccess.RoleCode))
        //     .catch((e) => console.log("Exception : " + e));

        // _hubConnection.on("ReceiveNotification", (response) => {
        //     console.log("Response API : " + response);
        //     if (response.type == "SUCCESS") {
        //         this.toastr.successMessageTitle(response.title, response.message);
        //     }
        //     else if (response.type == "ERROR") {
        //         this.toastr.errorMessageTitle(response.title, response.message);
        //     }
        //     else if (response.type == "INFO") {
        //         this.toastr.infoMessageTitle(response.title, response.message);
        //     }


        //     this.GetListNotifH();
        //     if (response.isNeedLogout == true) {
        //         AdInsHelper.ForceLogOut(response.timeLogOut, this.toastr);
        //     }
        //     //this.notifications.push({ title: response, desc: "User " + response });
        // });
    }

    GetListNotifH() {
        var requestObj = {
            isLoading: false
        };
        this.http.post(URLConstant.GetListNotificationHByRefUserId, { isLoading: false }).subscribe(
            (response) => {
                this.TotalUnread = response["TotalUnreadNotification"];
                this.NotificationHListObj = response["ResponseNotificationHCustomObjs"];
            });
    }

    InitNotification() {

    }

    ngAfterViewChecked() {

        // setTimeout(() => {
        //     var wrapperDiv = document.getElementsByClassName("wrapper")[0];
        //     var dir = wrapperDiv.getAttribute("dir");           
        //     if (dir == 'rtl') {
        //         this.placement = 'bottom-left';
        //     }
        //     else if (dir == 'ltr') {
        //         this.placement = 'bottom-right';
        //     }
        // }, 3000);


    }

    ClickNotification(item) {
        this.http.post(URLConstant.UpdateReadNotification, { NotificationDId: item.NotificationDId }).subscribe(
            (response) => {
            });
        if (item.MrNotificationMethodCode == "EXT_LINK") {
            window.open(item.Url, "_blank");
        }
        else if (item.MrNotificationMethodCode = "INT_LINK") {
            window.open(item.Url);
        }


    }


    logout() {
        var url = environment.FoundationR3Url + URLConstant.Logout;
        this.http.post(url, "");
        AdInsHelper.ClearAllLog();
        AdInsHelper.RedirectUrl(this.router, [NavigationConstant.PAGES_LOGIN], {});
    }

    ShowRole() {
        var data = { status: "200", reason: "OK" };
        this.rolePickService.openDialog(data, "modal");
    }


    ChangeLanguage(language: string) {
        this.translate.use(language);
    }

    changeModul(modul: string) {
        var token = localStorage.getItem(CommonConstant.TOKEN);
        var url = environment.FoundationR3Web + NavigationConstant.PAGES_LOGIN + "?token=" + token;
        window.open(url, "_blank");
    }

    ToggleClass() {
        if (this.toggleClass == 'ft-maximize') {
            this.toggleClass = 'ft-minimize';
        }
        else
            this.toggleClass = 'ft-maximize'
    }
}
