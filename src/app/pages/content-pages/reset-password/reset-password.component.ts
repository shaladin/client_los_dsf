import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { RefUserObj } from 'app/shared/model/ref-user-obj.model';
import { CustomPatternObj } from 'app/shared/model/library/custom-pattern-obj.model';



@Component({
  selector: "reset-password",
  templateUrl: "./reset-password.component.html",
  providers: [NGXToastrService]
})
export class ResetPasswordComponent implements OnInit {

  ResetPassForm = this.fb.group({
    NewPassword: ['', [Validators.required, Validators.maxLength(50)]],
    ConfirmPassword: ['', [Validators.required, Validators.maxLength(50)]],
  });

  version: string;
  isCompleted: boolean = false;
  isValidated: boolean = false;
  isLoaded: boolean = false;
  code: string = "";
  RefUserObj: RefUserObj;
  customPattern = new Array<CustomPatternObj>();
  
  constructor(private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder, private router: Router) {
    this.version = localStorage.getItem(CommonConstant.VERSION);
    this.code = this.route.snapshot.paramMap.get('code');
  }

  ngOnInit() {
    if (this.code != "") {
      this.getRefUser();
    }
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

  SaveForm() {
    if (this.ResetPassForm.controls["NewPassword"].value == this.ResetPassForm.controls["ConfirmPassword"].value) {
      var requestObj =
      {
        Username: this.RefUserObj.Username,
        NewPassword: this.ResetPassForm.controls["NewPassword"].value,
        Password: "-",
      };
      this.http.post(URLConstant.ResetPasswordByUsername, requestObj).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          this.isCompleted = true;
        });
    }
    else {
      this.toastr.warningMessage(ExceptionConstant.INCORRECT_PASSWORD);
    }
  }

  getRefUser() {
    var requestObj =
    {
      ResetCode: this.code
    };
    this.http.post(URLConstant.GetRefUserByResetCode, requestObj).subscribe(
      (response: RefUserObj) => {
        this.RefUserObj = response;
        if (this.RefUserObj.RefUserId != 0) {
          this.isValidated = true;
        }
        this.isLoaded = true;
      });
  }

  back() {
    AdInsHelper.RedirectUrl(this.router, [NavigationConstant.PAGES_LOGIN], {});
  }
}
