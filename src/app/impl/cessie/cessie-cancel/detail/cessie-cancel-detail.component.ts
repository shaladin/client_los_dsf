import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { CookieService } from 'ngx-cookie';
import { CurrentUserContext } from 'app/shared/model/current-user-context.model';
import { UcViewGenericObj } from 'app/shared/model/uc-view-generic-obj.model';
import { AppAgrmntCancelObj } from 'app/shared/model/app-agrmnt-cancel-obj.model';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { ReqGetByTypeCodeObj } from 'app/shared/model/ref-reason/req-get-by-type-code-obj.model';


@Component({
  selector: 'cessie-cancellation-detail',
  templateUrl: './cessie-cancel-detail.component.html'
})
export class CessieCancellationDetailComponent implements OnInit {

  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  CessieHXId: number;
  AppAgrmntCancelObj: AppAgrmntCancelObj;
  MainInfoForm = this.fb.group({
    ReasonCode: ['', Validators.required],
    CancelNotes: ['', Validators.required]
  });
  itemReasonCode: Array<KeyValueObj>;
  arrValue = [];
  readonly CancelLink: string = NavigationConstant.CESSIE_CANCEL_PAGING;

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
      if (params["CessieHXId"] != null) {
        this.CessieHXId = params["CessieHXId"];
      }
    });
  }
  Token: string;
  userContext: CurrentUserContext;
  ngOnInit() {
    this.Token = AdInsHelper.GetCookie(this.cookieService, CommonConstant.TOKEN);
    this.userContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    var refReasonObj: ReqGetByTypeCodeObj = {
      RefReasonTypeCode: CommonConstant.RefReasonTypeCodeAppAgrCncl
    }
    this.http.post(URLConstant.GetListActiveRefReason, refReasonObj).subscribe(
      (response) => {
        this.itemReasonCode = response[CommonConstant.ReturnObj];
        this.MainInfoForm.patchValue({
          ReasonCode: this.itemReasonCode[0].Key
        });
      }
    );
  }

  SaveForm() {
    var CancelReqObj = {
      ReasonCode: this.MainInfoForm.controls.ReasonCode.value,
      CancelNotes: this.MainInfoForm.controls.CancelNotes.value,
      CessieHXId: this.CessieHXId,
      CancelbyRefNo: this.userContext.EmpNo
    };

    this.http.post(URLConstantX.SubmitCancelV2, CancelReqObj).subscribe((response) => {
      this.toastr.successMessage(response['message']);
      AdInsHelper.RedirectUrl(this.router, [NavigationConstant.CESSIE_CANCEL_PAGING], {});
    });
  }
}
