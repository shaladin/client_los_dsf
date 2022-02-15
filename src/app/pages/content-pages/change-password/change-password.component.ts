import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CustomPatternObj } from 'app/shared/model/library/custom-pattern-obj.model';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password-new.component.html',
  providers: [NGXToastrService]
})
export class ChangePasswordComponent implements OnInit {

  isMatch = true;
  username: string;
  FoundationR3Url: string;
  UserAccess: Object;
  ResetPassForm = this.fb.group({
    OldPassword: ['', [Validators.required, Validators.maxLength(50)]],
    NewPassword: ['', [Validators.required, Validators.maxLength(50)]],
    ConfirmNewPassword: ['', [Validators.required, Validators.maxLength(50)]]
  });
  customPattern = new Array<CustomPatternObj>();
  showPass: Array<boolean> = Array<boolean>(3);

  constructor(private router: Router, private http: HttpClient, private route: ActivatedRoute, private toastr: NGXToastrService, private fb: FormBuilder, private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
      this.username = params['Username'];
    });
  }

  ngOnInit() {
    this.http.post(URLConstant.GetGeneralSettingValueByCode, { Code: CommonConstant.GsCodePasswordRegex }).subscribe(
      (response: { GsValue }) => {
        let patternObj: CustomPatternObj = new CustomPatternObj();
        patternObj.pattern = response.GsValue;
        patternObj.invalidMsg = ExceptionConstant.PWD_EXCEPTION;
        this.customPattern.push(patternObj);
        this.ResetPassForm.controls.NewPassword.setValidators([Validators.required, Validators.pattern(response.GsValue)]);
        this.ResetPassForm.controls.NewPassword.updateValueAndValidity();
      }
    );
  }

  eventValidatePassword() {
    if (this.ResetPassForm.value.NewPassword != this.ResetPassForm.value.ConfirmNewPassword) {
      this.isMatch = false;
    }
    else {
      this.isMatch = true;
    }
  }

  onSubmit() {
    if (this.isMatch) {
      const password = this.ResetPassForm.value.OldPassword;
      const newpassword = this.ResetPassForm.value.NewPassword;

      let context = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
      if (context != null) {
        this.username = context[CommonConstant.USER_NAME];
      }
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

  onClickShowPass(i) {
    this.showPass[i] = !this.showPass[i];
  }

}
