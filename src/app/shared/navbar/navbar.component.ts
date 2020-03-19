import { Component, AfterViewChecked } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RolePickService} from 'app/shared/rolepick/rolepick.service'; 
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { Router } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { formatDate } from '@angular/common';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
    providers:[RolePickService]
})

export class NavbarComponent implements AfterViewChecked {
    currentLang = 'en';
    toggleClass = 'ft-maximize';
    placement = 'bottom-right'
    displayName : string;
    userId : string;
    roleName : string;
    officeName : string;
    businessDate : string;
    public isCollapsed = true;
    token : string;
    userAccess : any;
    backgroundColor = environment.navbarColor;

    constructor(public translate: TranslateService,
        private router: Router,
        private http:HttpClient,public rolePickService: RolePickService) {
        const browserLang: string = translate.getBrowserLang();
        
        translate.use(browserLang.match(/en|id|pt|de/) ? browserLang : 'en');
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

    logout(){
        var url = environment.FoundationR3Url+AdInsConstant.Logout;
        this.http.post(url,"");
        AdInsHelper.ClearAllLog();
        this.router.navigate(['pages/login']);
    }

    ShowRole(){
        var data = {status:"200",reason:"OK"};
        this.rolePickService.openDialog(data,"modal");
    }


    ChangeLanguage(language: string) {
        this.translate.use(language);
    }

    changeModul(modul : string) {
        var token = localStorage.getItem("Token");
        var url = environment.losUrl +"?token="+token;
        window.open( url , "_blank");
    }

    ToggleClass() {
        if (this.toggleClass == 'ft-maximize') {
            this.toggleClass = 'ft-minimize';
        }
        else
            this.toggleClass = 'ft-maximize'
    }
}
