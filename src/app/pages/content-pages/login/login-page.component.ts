import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { HttpClient } from '@angular/common/http';
import { RolePickService } from 'app/shared/rolepick/rolepick.service';
import { environment } from 'environments/environment';

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
    FoundationR3Url: string;

    constructor(private router: Router, private http: HttpClient, public rolePickService : RolePickService,
        private route: ActivatedRoute) {
        //Ini buat check klo misal udah login jadi lgsg lempar ke tempat laennya lagi
        if(localStorage.getItem("UserContext") != null)
        {
            this.router.navigate(['dashboard/dash-board']);
        }
    }

    ngOnInit() {
        console.log("Init Login");
        this.FoundationR3Url = environment.FoundationR3Url;
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
                this.rolePickService.openDialog(object);
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