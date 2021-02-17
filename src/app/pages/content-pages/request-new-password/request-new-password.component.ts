import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { DatePipe } from '@angular/common';
import { environment } from 'environments/environment';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';



@Component({
  selector: "request-new-password",
  templateUrl: "./request-new-password.component.html",
  providers: [NGXToastrService]
})
export class RequestNewPasswordComponent implements OnInit {

  ReqPassForm = this.fb.group({
    Username: ['', [Validators.required, Validators.maxLength(50)]],
  });
  version: string;
  isRequested: boolean = false;
  censoredEmail: string = "";
  constructor(private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder, private router: Router) {
    this.version = localStorage.getItem(CommonConstant.VERSION);
  }

  ngOnInit() {


  }

  SaveForm() {
    var requestObj =
    {
      UserName: this.ReqPassForm.controls["Username"].value
    };
    this.http.post(URLConstant.RequestNewPassword, requestObj).subscribe(
      (response) => {
        this.censoredEmail = response["CensoredEmail"];
        this.isRequested = true;
      });
  }

  back() {
    AdInsHelper.RedirectUrl(this.router, [NavigationConstant.PAGES_LOGIN], {});
  }
}
