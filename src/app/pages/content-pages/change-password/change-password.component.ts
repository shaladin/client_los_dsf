import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CookieService } from 'ngx-cookie';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  providers: [NGXToastrService]
})
export class ChangePasswordComponent implements OnInit {

  @ViewChild('password') userPasswordRef: ElementRef;
  @ViewChild('newpassword') userNewPasswordRef: ElementRef;
  @ViewChild('confirmenwpassword') userConfirmNewPasswordRef: ElementRef;
  @ViewChild('changepasswordform') changePasswordForm: NgForm;

  isMatch = true;
  username: string;
  FoundationR3Url: string;
  UserAccess: Object;

  constructor(private router: Router, private http: HttpClient, private route: ActivatedRoute, private toastr: NGXToastrService, private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
      this.username = params['Username'];
    });
  }

  ngOnInit() {
    this.UserAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.username = this.UserAccess[CommonConstant.USER_NAME];
    this.eventValidatePassword(this.userConfirmNewPasswordRef.nativeElement);
    this.eventValidatePassword(this.userNewPasswordRef.nativeElement);
  }

  eventValidatePassword(any) {
    fromEvent(any, 'keyup').pipe(debounceTime(1000), distinctUntilChanged(), tap((text) => {
      if (this.userConfirmNewPasswordRef.nativeElement.value != this.userNewPasswordRef.nativeElement.value) {
        this.isMatch = false;
      }
      else {
        this.isMatch = true;
      }
    })).subscribe();
  }

  onSubmit(event) {
    if (this.isMatch) {
      const password = this.userPasswordRef.nativeElement.value;
      const newpassword = this.userNewPasswordRef.nativeElement.value;

      var requestObj = { "Username": this.username, "Password": password, "NewPassword": newpassword };
      this.http.post(URLConstant.ChangePasswordRefUserByUsername, requestObj).subscribe(
        (response) => {
          if (response["Message"] == "Success") {
            this.toastr.successMessage(response["message"]);
            this.router.navigateByUrl(NavigationConstant.DASHBOARD);
          }
          else {
            this.toastr.errorMessage("Invalid Password.");
          }
        }
      );
    }
    else
      this.toastr.errorMessage("Password Mismatch.");
  }

}
