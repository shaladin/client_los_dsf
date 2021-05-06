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
import { environment } from 'environments/environment';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { UcDropdownListObj } from 'app/shared/model/library/UcDropdownListObj.model';
import { ReqGetByTypeCodeObj } from 'app/shared/model/RefReason/ReqGetByTypeCodeObj.Model';

@Component({
  selector: 'app-asset-cancel-detail',
  templateUrl: './app-asset-cancel-detail.component.html'
})
export class AppAssetCancelDetailComponent implements OnInit {
  IsPoDone: boolean = false;
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  AppAssetId: any;
  AppAgrmntCancelObj: any;
  MainInfoForm = this.fb.group({
    ReasonCode: ['', Validators.required],
    CancelNotes: ['', Validators.required],
    PoReasonCode: [''],
    PoCancelNotes: ['']
  });
  itemReasonCode: any;
  ReasonCode: any;
  BizTemplateCode: string = "";
  ddlReason: UcDropdownListObj = new UcDropdownListObj();
  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService) {
    this.route.queryParams.subscribe(params => {
      this.AppAssetId = params["AppAssetId"];
    });
  }

  ngOnInit() {
    this.BizTemplateCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/opl/view-asset-opl-main-info.json";
    this.viewGenericObj.viewEnvironment = environment.losUrl;
    var refReasonObj: ReqGetByTypeCodeObj = {
      RefReasonTypeCode: CommonConstant.RefReasonTypeCodeAppAgrCncl
    }

    this.ddlReason = new UcDropdownListObj;
    this.ddlReason.enviromentUrl = environment.FoundationR3Url;
    this.ddlReason.apiPath = "/RefReason/GetListActiveRefReason";
    this.ddlReason.ddlType = "one";
    this.ddlReason.requestObj = refReasonObj;
    this.ddlReason.isObject = true;
    this.ddlReason.customObjName = "ReturnObject";
    this.ddlReason.isSelectOutput = true;
  }

  SaveForm() {
    var saveObj = {
      AppAssetId: this.AppAssetId,
      ReasonCode: this.MainInfoForm.controls.ReasonCode.value,
      CancelNotes: this.MainInfoForm.controls.CancelNotes.value,
      PoReasonCode: this.MainInfoForm.controls.PoReasonCode.value,
      PoCancelNotes: this.MainInfoForm.controls.PoCancelNotes.value,
    };
    this.http.post(URLConstant.AddAppAssetCancel, saveObj).subscribe((response) => {
      this.toastr.successMessage(response['message']);
      this.backToPaging();
    });
  }

  GetCallBack(ev: any) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.ViewObj.ProdOfferingCode, ev.ViewObj.ProdOfferingVersion);
    }
  }

  backToPaging() {
    AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADD_PRCS_APP_ASSET_CAN_PAGING], { BizTemplateCode: this.BizTemplateCode });
  }
}
