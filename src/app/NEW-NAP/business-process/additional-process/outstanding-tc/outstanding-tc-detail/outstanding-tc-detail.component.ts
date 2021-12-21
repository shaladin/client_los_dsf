import { Component, OnInit } from '@angular/core';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ListAppTCObj } from 'app/shared/model/list-app-tc-obj.model';
import { AppTCObj } from 'app/shared/model/app-tc-obj.model';
import { OutstandingTcObj } from 'app/shared/model/outstanding-tc-obj.model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcViewGenericObj } from 'app/shared/model/uc-view-generic-obj.model';
import { DMSObj } from 'app/shared/model/dms/dms-obj.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { forkJoin } from 'rxjs';
import { DMSLabelValueObj } from 'app/shared/model/dms/dms-label-value-obj.model';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { ResSysConfigResultObj } from 'app/shared/model/response/res-sys-config-result-obj.model';
import { MouCustObj } from 'app/shared/model/mou-cust-obj.model';
import { AgrmntTcObj } from 'app/shared/model/agrmnt-tc/agrmnt-tc-obj.model';
import { ReqSubmitAgrmntTcObj } from 'app/shared/model/agrmnt-tc/req-submit-agrmnt-tc-obj.model';

@Component({
  selector: 'app-outstanding-tc-detail',
  templateUrl: './outstanding-tc-detail.component.html',
  providers: [NGXToastrService]
})
export class OutstandingTcDetailComponent implements OnInit {
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  AppId: number;
  AgrmntId: number;
  listAgrmntTcObj: Array<AgrmntTcObj>;
  agrmntTcObj: AgrmntTcObj;
  BizTemplateCode: string;
  dmsObj: DMSObj = new DMSObj();
  custNo: string = "";
  appNo: string = "";
  mouCustNo: string = "";
  isDmsReady: boolean;
  SysConfigResultObj : ResSysConfigResultObj = new ResSysConfigResultObj();
  IsFromOutstandingTc: boolean = true;
  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private route: ActivatedRoute, private toastr: NGXToastrService, private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
      this.AppId = params["AppId"];
      this.AgrmntId = params["AgrmntId"];
      this.BizTemplateCode = params["BizTemplateCode"];
    });
  }

  OustandingTCForm = this.fb.group({});

  async ngOnInit() : Promise<void> {
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewAgrMainInfoPreGoLive.json";
    await this.http.post<ResSysConfigResultObj>(URLConstant.GetSysConfigPncplResultByCode, { Code: CommonConstant.ConfigCodeIsUseDms}).toPromise().then(
      (response) => {
        this.SysConfigResultObj = response
      });
    this.InitDms();
  }
  async InitDms() {
    if(this.SysConfigResultObj.ConfigValue == '1'){
      this.dmsObj = new DMSObj();
      let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
      this.dmsObj.User = currentUserContext.UserName;
      this.dmsObj.Role = currentUserContext.RoleCode;
      this.dmsObj.ViewCode = CommonConstant.DmsViewCodeApp;
      var appObj = { Id: this.AppId };
  
      let getCustNo = this.http.post(URLConstant.GetAppCustByAppId, appObj);
      let getAppNo = this.http.post(URLConstant.GetAppById, appObj);
      forkJoin([getCustNo, getAppNo]).subscribe(
        (response) => {
          this.custNo = response[0]['CustNo'];
          var mouCustId = response[1]['MouCustId'];
          this.appNo = response[1]['AppNo'];
          if (this.custNo != null && this.custNo != '') {
            this.dmsObj.MetadataParent.push(new DMSLabelValueObj(CommonConstant.DmsNoCust, this.custNo));
          }
          else {
            this.dmsObj.MetadataParent = null;
          }
          this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsNoApp, this.appNo));
          this.dmsObj.Option.push(new DMSLabelValueObj(CommonConstant.DmsOverideSecurity, CommonConstant.DmsOverideUploadDownloadView));
          if (mouCustId != null && mouCustId != '') {
            this.http.post(URLConstant.GetMouCustById, { Id: mouCustId }).subscribe(
              (response: MouCustObj) => {
                this.mouCustNo = response.MouCustNo;
                this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsMouId, this.mouCustNo));
                this.isDmsReady = true;
              });
          }
          else {
            this.isDmsReady = true;
          }
        }
      );
    }
  }

  SaveForm() {
    this.listAgrmntTcObj = new Array<AgrmntTcObj>();

    for (var i = 0; i < this.OustandingTCForm.value.TCList["length"]; i++) {
      this.agrmntTcObj = new AgrmntTcObj();
      this.agrmntTcObj.AgrmntId = this.OustandingTCForm.value.TCList[i].AgrmntId;
      this.agrmntTcObj.AgrmntTcId = this.OustandingTCForm.value.TCList[i].AgrmntTcId;
      this.agrmntTcObj.TcCode = this.OustandingTCForm.value.TCList[i].TcCode;
      this.agrmntTcObj.TcName = this.OustandingTCForm.value.TCList[i].TcName;
      this.agrmntTcObj.PriorTo = this.OustandingTCForm.value.TCList[i].PriorTo;
      this.agrmntTcObj.IsChecked = this.OustandingTCForm.getRawValue().TCList[i].IsChecked;
      this.agrmntTcObj.ExpiredDt = this.OustandingTCForm.getRawValue().TCList[i].ExpiredDt;
      this.agrmntTcObj.IsMandatory = this.OustandingTCForm.value.TCList[i].IsMandatory;
      this.agrmntTcObj.PromisedDt = this.OustandingTCForm.getRawValue().TCList[i].PromisedDt;
      this.agrmntTcObj.IsWaived = this.OustandingTCForm.getRawValue().TCList[i].IsWaived;
      this.agrmntTcObj.IsExpDtMandatory = this.OustandingTCForm.getRawValue().TCList[i].IsExpDtMandatory;
      this.agrmntTcObj.IsWaivable = this.OustandingTCForm.getRawValue().TCList[i].IsWaivable;
      this.agrmntTcObj.CheckedDt = this.OustandingTCForm.value.TCList[i].CheckedDt;
      this.agrmntTcObj.Notes = this.OustandingTCForm.value.TCList[i].Notes;
      this.agrmntTcObj.IsAdditional = this.OustandingTCForm.value.TCList[i].IsAdditional;
      this.listAgrmntTcObj.push(this.agrmntTcObj);
    }

    var reqSubmitAgrmntTcObj = new ReqSubmitAgrmntTcObj();
    reqSubmitAgrmntTcObj.AgrmntId = this.AgrmntId;
    reqSubmitAgrmntTcObj.ListAgrmntTcObj = this.listAgrmntTcObj;

    this.http.post(URLConstant.SubmitAgrmntTc, reqSubmitAgrmntTcObj).subscribe(
      response => {
        this.toastr.successMessage(response["message"]);
        AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADD_PRCS_OUTSTANDING_TC_PAGING], { BizTemplateCode: this.BizTemplateCode });
      }
    );
  }

  Back() {
    AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADD_PRCS_OUTSTANDING_TC_PAGING], { BizTemplateCode: this.BizTemplateCode });
  }
  
  GetCallBack(ev) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.ViewObj.ProdOfferingCode, ev.ViewObj.ProdOfferingVersion);
    }
  }
}
