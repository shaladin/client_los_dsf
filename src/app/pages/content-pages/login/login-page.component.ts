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
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { RolePickNewService } from 'app/shared/rolepick/rolepick-new.service';
import { GeneralSettingObj } from 'app/shared/model/general-setting-obj.model';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page-new.component.html',
  styleUrls: ['./login-page.component.scss'],
  providers: [RolePickService, NGXToastrService]
})

export class LoginPageComponent implements OnInit {
  @ViewChild('user') userInputRef: ElementRef;
  @ViewChild('pass') userPassRef: ElementRef;
  @ViewChild('otp') otpInputRef: ElementRef;
  @ViewChild('f') loginForm: NgForm;
  private apiUrl: string;
  IsNeedUpdate: boolean;
  token: string;
  version: string;
  result: any;
  mode: string = "login";
  otpProperties: any;
  timer: any;
  onGoingTimer: number = 0;
  counterOtp: number = -1;
  otpConfirmCount: number = 0;
  loginObj = {
    response: {},
    user: "",
    pwd: ""
  };
  isInvalidOtp: boolean = false;
  isUseNewRolepick: boolean = false;
  isEod: boolean = false;

  constructor(private router: Router, private http: HttpClient, public rolePickService: RolePickService,  public rolePickNewService: RolePickNewService,
    private route: ActivatedRoute, private cookieService: CookieService,private toastr: NGXToastrService) {
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
    await this.http.post(URLConstant.GetGeneralSettingValueByCode, {Code: CommonConstant.IS_USE_NEW_ROLEPICK}).toPromise().then(
      (response: GeneralSettingObj) => {
        this.isUseNewRolepick = response.GsValue == '1' ? true : false;
        AdInsHelper.SetLocalStorage(CommonConstant.IS_USE_NEW_ROLEPICK, response.GsValue);
      }
    );
    if(!this.isUseNewRolepick) {
      this.loginObj.response = "";
    }
    if (this.token != null) {
      await this.http.post(AdInsConstant.LoginWithToken, {ModuleCode: environment.Module},  {withCredentials: true}).toPromise().then(
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
    else{
      this.http.post(URLConstant.GetOtpProperties, {}).subscribe(
        (response) => {
          this.otpProperties = response;
        }
      );
      this.http.post(URLConstant.GetSysCtrlCoyBySysKey, {Code: CommonConstant.IsEODRun}).subscribe(
        (response) => {
          if(response["SysValue"] == '1')
          {
            this.isEod = true;
          }
        }
      );
    }
  }

  onSubmit(event) {
    event.preventDefault();
    const username = this.userInputRef.nativeElement.value;
    const password = this.userPassRef.nativeElement.value;
    var requestObj = { "Username": username, "Password": password };
    //this.rolePickService.openDialog(data.returnObject);

    // this.http.post(AdInsConstant.LoginV2, requestObj).subscribe(
    this.http.post(AdInsConstant.LoginV2, requestObj).subscribe(
      async (response) => {
        if (response["StatusCode"] == CommonConstant.STATUS_CODE_USER_LOCKED) {
          this.mode = "locked";
        }
        else {
          //this.cookieService.put("username", username);

          if(this.isUseNewRolepick) {
            await this.http.post(AdInsConstant.GetListJobTitleByUsernameAndModuleV2, {UserName : username, Module : environment.Module}, AdInsConstant.SpinnerOptions).toPromise().then(
              (response) => {
                this.loginObj.response = response;
              });
          }
          else {
            await this.http.post(AdInsConstant.GetListJobTitleByUsernameAndModule, {UserName : username, Module : environment.Module}).toPromise().then(
              (response) => {
                this.loginObj.response = response["ListOfficeRoleJobTitle"];
              });
          }
          this.loginObj.user = username;
          this.loginObj.pwd = password;
          
          await this.http.post<any>(URLConstant.GetUserEmpByUsername, requestObj).toPromise().then(
            (response) => {
              this.result = response;
              if (this.result.IsNeedUpdatePassword) {
                this.toastr.warningMessage(ExceptionConstant.EXP_PASSWORD);
                this.router.navigate([NavigationConstant.PAGES_CHANGE_PASSWORD], { queryParams: { "Username": username } });
              }
              else {
                if(this.otpProperties['IsUseOtp']){
                  this.sendOtp();
                }
                else{
                  this.selectRole();
                }
              }
            }
          )
        };
      }
    );
  }

  onSubmitOtp(){
    if(this.onGoingTimer >= this.otpProperties.ExpiredTimeOTP){
      this.toastr.errorMessage("OTP code has expired, please regenerate OTP code!"); 
    }
    else if(this.otpInputRef.nativeElement.value != ""){
      let reqConfirmOtpObj = {
        Username:this.result.Username, 
        Counter: this.counterOtp,
        InputOtp: this.otpInputRef.nativeElement.value,
        IsLastAttempt: this.otpConfirmCount >= this.otpProperties['MaxAttempOTP'] ? true : false
      }

      this.http.post<any>(URLConstant.ConfirmOtp, reqConfirmOtpObj).subscribe(
        (response) => {
          if(response.IsOtpMatch){
            this.selectRole();
          }
          else{
            this.isInvalidOtp = true;       
          }
          this.otpConfirmCount++;
        },
        (error) => {
          this.toastr.errorMessage(error);
        }
      );
    }
  }

  onRegenerateClick(){
    this.counterOtp = -1;
    this.sendOtp();
    this.isInvalidOtp = false;
  }

  sendOtp(){
    this.http.post<any>(URLConstant.SendOtp, {Counter: this.counterOtp, Username: this.result.Username}).subscribe(
      (response) => {
        this.toastr.successMessage(response.msg);
        this.counterOtp = response.Counter;
        this.resetTimer();
        if(this.mode != "otp"){
          this.mode = "otp";
        }
      },
      (error) => {
        this.toastr.errorMessage(error);
      }
    );
  }

  selectRole(){
    if(this.isUseNewRolepick) {
      this.rolePickNewService.openDialog(this.loginObj);
    }
    else {
      this.rolePickService.openDialog(this.loginObj);
    }
    let object2 = {
      Usernames: [
        this.loginObj.user
      ],
      Role: "",
      Message: "",
      Title: "Password Expiration",
      Type: "Notification"
    };
    // this.http.post(URLConstant.SendNotificationRemainingPasswordExpirationDaysToUser, object2).subscribe();    
  }

  startTimer() {
    this.timer = setInterval(() => {
      this.onGoingTimer++
    },1000)
  }

  resetTimer(){
    clearInterval(this.timer);
    this.onGoingTimer = 0
    this.startTimer();
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
