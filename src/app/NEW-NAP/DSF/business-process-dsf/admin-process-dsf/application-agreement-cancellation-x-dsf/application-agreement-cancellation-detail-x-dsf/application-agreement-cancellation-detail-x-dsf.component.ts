import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AppAgrmntCancelObj } from 'app/shared/model/app-agrmnt-cancel-obj.model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcViewGenericObj } from 'app/shared/model/uc-view-generic-obj.model';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { ReqGetByTypeCodeObj } from 'app/shared/model/ref-reason/req-get-by-type-code-obj.model';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { environment } from 'environments/environment';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { NavigationConstantDsf } from 'app/shared/constant/NavigationConstantDsf';
import { URLConstantDsf } from 'app/shared/constant/URLConstantDsf';
import { AppObj } from 'app/shared/model/app/app.model';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';

@Component({
  selector: 'app-application-agreement-cancellation-detail-x-dsf',
  templateUrl: './application-agreement-cancellation-detail-x-dsf.component.html',
  styleUrls: ['./application-agreement-cancellation-detail-x-dsf.component.css']
})
export class ApplicationAgreementCancellationDetailXDsfComponent implements OnInit {

  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  AppId: number;
  ReqByTrxNo: GenericObj = new GenericObj();
  AgrmntId: number;
  AppAgrmntCancelObj: AppAgrmntCancelObj;
  BizTemplateCode: string;
  MainInfoForm = this.fb.group({
    ReasonCode: ['', Validators.required],
    CancelNotes: ['', Validators.required]
  });
  itemReasonCode: Array<KeyValueObj>;
  arrValue = [];
  readonly CancelLink: string = NavigationConstant.BACK_TO_PAGING;
  appData: AppObj;

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
    this.arrValue.push(this.AppId);
    this.arrValue.push(this.AgrmntId);
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewApplicationAgreementCancellation.json";
    this.viewGenericObj.whereValue = this.arrValue;

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

  // Self Custom CR MPF Validation
  async SaveForm() {
    this.AppAgrmntCancelObj = new AppAgrmntCancelObj();
    this.AppAgrmntCancelObj = this.MainInfoForm.value;
    this.AppAgrmntCancelObj.AppId = this.AppId;
    this.AppAgrmntCancelObj.AgrmntId = this.AgrmntId;
    this.AppAgrmntCancelObj.CancelByRefNo = "null";
    this.AppAgrmntCancelObj.RowVersion = "";

    await this.http.post(URLConstant.GetAppById, { Id: this.AppId }).toPromise().then(
      (response: AppObj) => {
          this.appData = response;
    });

    this.ReqByTrxNo.TrxNo = this.appData.AppNo;

    await this.http.post(URLConstantDsf.DeactivateAgrmntMasterXDsf, this.ReqByTrxNo).toPromise().then(
      (response) => {
    });

    await this.http.post(URLConstantX.AddAppAgrmntCancelV4X, this.AppAgrmntCancelObj).toPromise().then((response) => {
      this.toastr.successMessage(response['message']);
      AdInsHelper.RedirectUrl(this.router, [NavigationConstantDsf.NAP_ADM_PRCS_AGRMNT_CANCEL_PAGING], { BizTemplateCode: this.BizTemplateCode });
    });
  }
  // End Self Custom CR MPF Validation

  GetCallBack(ev) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.ViewObj.ProdOfferingCode, ev.ViewObj.ProdOfferingVersion);
    }
  }

}
