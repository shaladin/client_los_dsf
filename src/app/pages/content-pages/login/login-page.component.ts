import { Component, ViewChild, OnInit, ElementRef, SkipSelf } from '@angular/core';
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
  FoundationR3Url: string;
  token: string;
  version: string;
  result: any;
  isLocked: boolean = false;
  constructor(private router: Router, private http: HttpClient, public rolePickService: RolePickService,
    private route: ActivatedRoute, private cookieService: CookieService) {
    //Ini buat check klo misal udah login jadi lgsg lempar ke tempat laennya lagi

    this.version = localStorage.getItem(CommonConstant.VERSION);
    this.route.queryParams.subscribe(params => {
      if (params['token'] != null) {
        this.token = params['token'];
      }
    });

    if (AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS) != null) {
      AdInsHelper.RedirectUrl(this.router, [NavigationConstant.DASHBOARD], {});
    }
  }

  ngOnInit() {

    this.FoundationR3Url = environment.FoundationR3Url;


    if (this.token != null) {
      localStorage.setItem("Token", this.token);
      this.http.post(URLConstant.LoginWithToken, { ModuleCode: environment.Module }).subscribe(
        (response) => {
          AdInsHelper.CreateUserAccess(response);
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.DASHBOARD], {});
        });
    }
  }

  onSubmit(event) {
    event.preventDefault();
    const username = this.userInputRef.nativeElement.value;
    const password = this.userPassRef.nativeElement.value;
    this.apiUrl = this.FoundationR3Url + URLConstant.Login;
    var requestObj = { "Username": username, "Password": password };
    localStorage.setItem("Username", username);
    //this.rolePickService.openDialog(data.returnObject);
    this.http.post(this.apiUrl, requestObj).subscribe(
      (response) => {
        if (response["StatusCode"] == CommonConstant.STATUS_CODE_USER_LOCKED) {
          this.isLocked = true;
        }
        else {
          localStorage.setItem("Username", username);
          const object = {
            response: response[CommonConstant.ReturnObj],
            user: username,
            pwd: password
          };
          this.http.post(URLConstant.GetRefUserByUsername, requestObj).subscribe(
            (response) => {
              this.result = response;
              if (this.result.IsNeedUpdatePassword) {
                this.router.navigate(['/pages/ChangePassword'], { queryParams: { "Username": username } });
              }
              else {
                this.rolePickService.openDialog(object);

              }
            },
            () => {

            })
        }
      });
  }
  // On Forgot password link click
  onForgotPassword() {
    AdInsHelper.RedirectUrl(this.router, [NavigationConstant.BACK_TO_REQ_PASSWORD], {});
  }
  // On registration link click
  onRegister() {
    this.router.navigate(['register'], { relativeTo: this.route.parent });
  }
}
