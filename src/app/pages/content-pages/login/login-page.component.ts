import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { RolePickService } from 'app/shared/rolepick/rolepick.service';
import { environment } from 'environments/environment';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
  providers: [RolePickService]
})

export class LoginPageComponent implements OnInit {
  @ViewChild('user') userInputRef: ElementRef;
  @ViewChild('pass') userPassRef: ElementRef;
  @ViewChild('f') loginForm: NgForm;
  private apiUrl: string;
  IsNeedUpdate: boolean;
  token: string;
  version: string;
  result: any;
  isLocked: boolean = false;
  loginObj = {
    response: "",
    user: "",
    pwd: ""
  };

  constructor(private router: Router, private http: HttpClient, public rolePickService: RolePickService,
    private route: ActivatedRoute, private cookieService: CookieService) {
    //Ini buat check klo misal udah login jadi lgsg lempar ke tempat laennya lagi

    this.version = localStorage.getItem(CommonConstant.VERSION);
    this.route.queryParams.subscribe(params => {
      if (params['token'] != null) {
        this.token = params['token'];
        AdInsHelper.SetCookie(this.cookieService, CommonConstant.TOKEN, this.token);
      }
    });

    if (AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS) != null) {
      AdInsHelper.RedirectUrl(this.router, [NavigationConstant.DASHBOARD], {});
    }
  }

  async ngOnInit() {
    if (this.token != null) {
      localStorage.setItem("Token", this.token);
      await this.http.post(AdInsConstant.LoginWithToken, { ModuleCode: environment.Module }).toPromise().then(
        async (response) => {
          AdInsHelper.CreateUserAccess(response);

          var DateParse = formatDate(response["Identity"].BusinessDt, 'yyyy/MM/dd', 'en-US');
          AdInsHelper.SetCookie(this.cookieService, "BusinessDateRaw", formatDate(response["Identity"].BusinessDt, 'yyyy/MM/dd', 'en-US'));
          AdInsHelper.SetCookie(this.cookieService, "BusinessDate", DateParse);
          AdInsHelper.SetCookie(this.cookieService, "UserAccess", JSON.stringify(response["Identity"]));
          AdInsHelper.SetCookie(this.cookieService, "Username", JSON.stringify(response["Identity"]["UserName"]));
          AdInsHelper.SetCookie(this.cookieService, CommonConstant.TOKEN, response['Token']);
          AdInsHelper.SetLocalStorage(CommonConstant.ENVIRONMENT_MODULE, environment.Module);

          await this.http.post(AdInsConstant.GetAllActiveRefFormByRoleCodeAndModuleCode, { RoleCode: response["Identity"].RoleCode, ModuleCode: environment.Module }, { withCredentials: true }).toPromise().then(
            (response) => {
              AdInsHelper.SetLocalStorage(CommonConstant.MENU, JSON.stringify(response[CommonConstant.ReturnObj]));
              AdInsHelper.RedirectUrl(this.router, [NavigationConstant.DASHBOARD], {});
            });
        });
    }
  }

  onSubmit(event) {
    event.preventDefault();
    const username = this.userInputRef.nativeElement.value;
    const password = this.userPassRef.nativeElement.value;
    var requestObj = { "Username": username, "Password": password };
    localStorage.setItem("Username", username);
    //this.rolePickService.openDialog(data.returnObject);

    let LoginURL = environment.isCore ? AdInsConstant.LoginV2 : AdInsConstant.Login;
    this.http.post(LoginURL, requestObj).subscribe(
      async (response) => {
        if (response["StatusCode"] == CommonConstant.STATUS_CODE_USER_LOCKED) {
          this.isLocked = true;
        }
        else {
          if(environment.isCore){
            await this.http.post(AdInsConstant.GetListJobTitleByUsernameAndModule, {UserName : username, Module : environment.Module}).toPromise().then(
              (response) => {
                this.loginObj.response = response["ListOfficeRoleJobTitle"]
              });
          }else{
            this.loginObj.response = response[CommonConstant.ReturnObj];
          }
          this.loginObj.user = username;
          this.loginObj.pwd = password;

          await this.http.post(URLConstant.GetRefUserByUsername, requestObj).toPromise().then(
            (response) => {
              this.result = response;
              if (this.result.IsNeedUpdatePassword) {
                this.router.navigate(['/pages/ChangePassword'], { queryParams: { "Username": username } });
              }
              else {
                this.rolePickService.openDialog(this.loginObj);

              }
            },
            () => {

            })
        }
      });
  }
  // On Forgot password link click
  onForgotPassword() {
    AdInsHelper.RedirectUrl(this.router, [NavigationConstant.PAGES_REQ_PASSWORD], {});
  }
  // On registration link click
  onRegister() {
    this.router.navigate(['register'], { relativeTo: this.route.parent });
  }
}
