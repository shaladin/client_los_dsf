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
  selector: 'app-cancel-detail',
  templateUrl: './app-cancel-detail.component.html'
})
export class AppCancelDetailComponent implements OnInit {

  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  AppId: any;
  AppAgrmntCancelObj: any;
  MainInfoForm = this.fb.group({
    ReasonCode: ['', Validators.required],
    CancelNotes: ['', Validators.required],
    IsContractSigned: [false, Validators.required]
  });
  itemReasonCode: any;
  ReasonCode: any;
  BizTemplateCode: string = "";
  ddlReason: UcDropdownListObj = new UcDropdownListObj();
  AgrmntId: any;
  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService) {
    this.route.queryParams.subscribe(params => {
      this.AppId = params["AppId"];
      this.AgrmntId = params["AgrmntId"];
    });
    if (this.AgrmntId == "AgrmntId") {
      this.AgrmntId = 0;
    }
  }

  ngOnInit() {
    this.BizTemplateCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewNapAppOPLMainInformation.json";
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
    this.AppAgrmntCancelObj = new AppAgrmntCancelObj();
    this.AppAgrmntCancelObj = this.MainInfoForm.value;
    this.AppAgrmntCancelObj.AppId = this.AppId;
    this.AppAgrmntCancelObj.AgrmntId = this.AgrmntId;
    this.AppAgrmntCancelObj.CancelByRefNo = "null";

    this.http.post(URLConstant.AddAppAgrmntCancel, this.AppAgrmntCancelObj).subscribe((response) => {
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
    AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADD_PRCS_APP_CAN_PAGING], { BizTemplateCode: this.BizTemplateCode });
  }
}
