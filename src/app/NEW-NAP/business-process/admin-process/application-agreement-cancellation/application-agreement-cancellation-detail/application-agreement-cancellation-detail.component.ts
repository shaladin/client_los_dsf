import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AppAgrmntCancelObj } from 'app/shared/model/AppAgrmntCancelObj.Model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { ReqGetByTypeCodeObj } from 'app/shared/model/RefReason/ReqGetByTypeCodeObj.Model';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';

@Component({
  selector: 'app-application-agreement-cancellation-detail',
  templateUrl: './application-agreement-cancellation-detail.component.html'
})
export class ApplicationAgreementCancellationDetailComponent implements OnInit {

  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  AppId: number;
  AgrmntId: number;
  AppAgrmntCancelObj: AppAgrmntCancelObj;
  BizTemplateCode : string;
  MainInfoForm = this.fb.group({
    ReasonCode: ['', Validators.required],
    CancelNotes: ['', Validators.required]
  });
  itemReasonCode: Array<KeyValueObj>;

  readonly CancelLink: string = NavigationConstant.BACK_TO_PAGING;

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService) {
    this.route.queryParams.subscribe(params => {
      if (params["AppId"] != null) {        
        this.AppId = params["AppId"];
      }
      if (params["AgrmntId"] != null) {
        this.AgrmntId = params["AgrmntId"];
      }
      if (params["BizTemplateCode"] != null) {
        this.BizTemplateCode = params["BizTemplateCode"];
      }
    });
  }

  ngOnInit() {
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewApplicationAgreementCancellation.json";

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
    this.AppAgrmntCancelObj = new AppAgrmntCancelObj();
    this.AppAgrmntCancelObj = this.MainInfoForm.value;
    this.AppAgrmntCancelObj.AppId = this.AppId;
    this.AppAgrmntCancelObj.AgrmntId = this.AgrmntId;
    this.AppAgrmntCancelObj.CancelByRefNo = "null";
    this.AppAgrmntCancelObj.RowVersion = "";

    this.http.post(URLConstant.AddAppAgrmntCancel, this.AppAgrmntCancelObj).subscribe((response) => {
      this.toastr.successMessage(response['message']);
      AdInsHelper.RedirectUrl(this.router,[NavigationConstant.NAP_ADM_PRCS_AGRMNT_CANCEL_PAGING], { BizTemplateCode: this.BizTemplateCode });
    });
  }

  GetCallBack(ev) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.ViewObj.ProdOfferingCode, ev.ViewObj.ProdOfferingVersion);
    }
  }
}
