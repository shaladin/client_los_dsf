import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { formatDate } from '@angular/common';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CurrentUserContext } from 'app/shared/model/CurrentUserContext.model';
import { HttpClient } from '@angular/common/http';
import { RolePickService } from 'app/shared/rolepick/rolepick.service';
import { environment } from 'environments/environment';
import { CurrentUserContextService } from 'app/shared/CurrentUserContext/current-user-context.service';

@Component({
    selector: 'app-login-page',
    templateUrl: './login-page.component.html',
    styleUrls: ['./login-page.component.scss'],
    providers:[RolePickService]
})

export class LoginPageComponent implements OnInit {
    @ViewChild('user') userInputRef: ElementRef;
    @ViewChild('pass') userPassRef: ElementRef;
    @ViewChild('f') loginForm: NgForm;
    private apiUrl: string;
    IsNeedUpdate : boolean;
    FoundationR3Url: string;
    token:string;
    result: any;

    constructor(private router: Router, private http: HttpClient, public rolePickService : RolePickService,
        private route: ActivatedRoute,
        private currentUserContextService: CurrentUserContextService) {
        //Ini buat check klo misal udah login jadi lgsg lempar ke tempat laennya lagi

        this.route.queryParams.subscribe(params => {
            if (params['token'] != null) {
              this.token = params['token'];
            }
          });
      
        if(localStorage.getItem("UserContext") != null)
        {
            this.router.navigate(['dashboard/dash-board']);
        }
    }

    ngOnInit() {
        console.log("Init Login");
        this.FoundationR3Url = environment.FoundationR3Url;
        

        if(this.token!=null)
        {
            localStorage.setItem("Token",this.token);
            this.http.post(AdInsConstant.LoginWithToken, {ModuleCode:environment.Module}).subscribe(
                (response) => {
                    console.log(response);
                    var currentUserContext = new CurrentUserContext;
                    currentUserContext.UserName = response["Identity"].UserName;
                    currentUserContext.Office = response["Identity"].OfficeCode;
                    currentUserContext.Role = response["Identity"].RoleCode;
                    currentUserContext.BusinessDate = response["Identity"].BusinessDt;
                    localStorage.setItem("BusinessDateRaw",response["Identity"].BusinessDt);
                    var DateParse = formatDate(response["Identity"].BusinessDt, 'yyyy/MM/dd', 'en-US');
                    localStorage.setItem("BusinessDate", DateParse);
                    localStorage.setItem("UserAccess", JSON.stringify(response["Identity"]));
                    this.currentUserContextService.addCurrentUserContext(currentUserContext);
                    this.router.navigate(['dashboard/dash-board']);
                },
                (error) => {
                    console.log(error);
                }
            );
        }
    }
    
    onSubmit(event) {
        event.preventDefault();
        const username = this.userInputRef.nativeElement.value;
        const password = this.userPassRef.nativeElement.value;
        this.apiUrl = this.FoundationR3Url + AdInsConstant.Login;
        var requestObj = { "Username": username, "Password": password };
        localStorage.setItem("Username",username);
        console.log("Login Page Comp");
        //this.rolePickService.openDialog(data.returnObject);
        this.http.post(this.apiUrl, requestObj).subscribe(
            (response) => {
                console.log(response);
                localStorage.setItem("Username",username);
                const object = {
                    response: response["ReturnObject"],
                    user: username,
                    pwd: password
                };
                this.http.post(AdInsConstant.GetRefUserByUsername, requestObj).subscribe(
                (response) => {
                   this.result = response;
                   if(this.result.IsNeedUpdatePassword){
                    this.router.navigate(['/pages/ChangePassword'], { queryParams: { "Username": username } });
                   }
                   else{
                    this.rolePickService.openDialog(object);

                   }
                },
                (error) => {

                })
            },
            (error) => {
                console.log(error);
            }
        );
    }
    // On Forgot password link click
    onForgotPassword() {
        this.router.navigate(['forgotpassword'], { relativeTo: this.route.parent });
    }
    // On registration link click
    onRegister() {
        this.router.navigate(['register'], { relativeTo: this.route.parent });
    }
}