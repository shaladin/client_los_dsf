import { Component, OnInit } from '@angular/core';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ListAppTCObj } from 'app/shared/model/ListAppTCObj.Model';
import { AppTCObj } from 'app/shared/model/AppTCObj.Model';
import { OutstandingTcObj } from 'app/shared/model/OutstandingTcObj.Model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { environment } from 'environments/environment';
import { DMSObj } from 'app/shared/model/DMS/DMSObj.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { forkJoin } from 'rxjs';
import { DMSLabelValueObj } from 'app/shared/model/DMS/DMSLabelValueObj.Model';

@Component({
  selector: 'app-outstanding-tc-detail',
  templateUrl: './outstanding-tc-detail.component.html',
  providers: [NGXToastrService]
})
export class OutstandingTcDetailComponent implements OnInit {
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  AppId: number;
  listAppTCObj: any;
  appTC: any;
  outstandingTcObj: any;
  BizTemplateCode: any;
  dmsObj : DMSObj = new DMSObj();
  custNo: string = "";
  appNo: string = "";
  mouCustNo: string ="";
  isDmsReady: boolean;
  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private route: ActivatedRoute, private toastr: NGXToastrService) {
    this.route.queryParams.subscribe(params => {
      this.AppId = params["AppId"];
      this.BizTemplateCode = params["BizTemplateCode"];
    });
  }

  OustandingTCForm = this.fb.group({});

  ngOnInit() {
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewOutstandingTC.json";
    this.viewGenericObj.viewEnvironment = environment.losUrl;
    this.viewGenericObj.ddlEnvironments = [
      {
        name: "AppNo",
        environment: environment.losR3Web
      },
    ];
    this.InitDms();
  }
  async InitDms(){
    this.dmsObj = new DMSObj();
    let currentUserContext = JSON.parse(localStorage.getItem("UserAccess"));
    this.dmsObj.User = currentUserContext.UserName;
    this.dmsObj.Role = currentUserContext.RoleCode;
    this.dmsObj.ViewCode = CommonConstant.DmsViewCodeApp;
    var appObj = { AppId: this.AppId };

    let getCustNo = this.http.post(URLConstant.GetAppCustByAppId, appObj);
    let getAppNo = this.http.post(URLConstant.GetAppById, appObj);
    forkJoin([getCustNo, getAppNo]).subscribe(
      (response) => {
        this.custNo = response[0]['CustNo'];
        var mouCustId = response[1]['MouCustId'];
        this.appNo = response[1]['AppNo'];
        if(this.custNo != null && this.custNo != ''){
          this.dmsObj.MetadataParent.push(new DMSLabelValueObj(CommonConstant.DmsNoCust, this.custNo));
        }
        else{
          this.dmsObj.MetadataParent = null;
        }
        this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsNoApp, this.appNo));
        this.dmsObj.Option.push(new DMSLabelValueObj(CommonConstant.DmsOverideSecurity, CommonConstant.DmsOverideUploadView));
        if(mouCustId != null && mouCustId != ''){
          var mouObj = {MouCustId : mouCustId };
          this.http.post(URLConstant.GetMouCustById, mouObj).subscribe(
            (response) => {
              this.mouCustNo = response['MouCustNo'];
              this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsMouId, this.mouCustNo));
              this.isDmsReady = true;
            });
        }
        else{
          this.isDmsReady = true;
        }
      }
    );
  }


  SaveForm() {
    this.outstandingTcObj = new OutstandingTcObj();

    this.listAppTCObj = new ListAppTCObj();
    this.listAppTCObj.AppTCObj = new Array();

    for (var i = 0; i < this.OustandingTCForm.value.TCList["length"]; i++) {
      this.appTC = new AppTCObj();
      this.appTC.AppId = this.OustandingTCForm.value.TCList[i].AppId;
      this.appTC.AppTcId = this.OustandingTCForm.value.TCList[i].AppTcId;
      this.appTC.TcCode = this.OustandingTCForm.value.TCList[i].TcCode;
      this.appTC.TcName = this.OustandingTCForm.value.TCList[i].TcName;
      this.appTC.PriorTo = this.OustandingTCForm.value.TCList[i].PriorTo;
      this.appTC.IsChecked = this.OustandingTCForm.getRawValue().TCList[i].IsChecked;
      this.appTC.ExpiredDt = this.OustandingTCForm.getRawValue().TCList[i].ExpiredDt;
      this.appTC.IsMandatory = this.OustandingTCForm.value.TCList[i].IsMandatory;
      this.appTC.PromisedDt = this.OustandingTCForm.getRawValue().TCList[i].PromisedDt;
      this.appTC.CheckedDt = this.OustandingTCForm.value.TCList[i].CheckedDt;
      this.appTC.Notes = this.OustandingTCForm.value.TCList[i].Notes;
      this.listAppTCObj.AppTCObj.push(this.appTC);
    }

    this.outstandingTcObj.ListAppTCObj = this.listAppTCObj.AppTCObj;

    this.http.post(URLConstant.SubmitOutstandingTc, this.outstandingTcObj).subscribe(
      response => {
        this.toastr.successMessage(response["message"]);
        AdInsHelper.RedirectUrl(this.router, ["/Nap/AddProcess/OutstandingTC/Paging"], { BizTemplateCode: this.BizTemplateCode });
      }
    );
  }

  Back() {
    AdInsHelper.RedirectUrl(this.router, ["/Nap/AddProcess/OutstandingTC/Paging"], { BizTemplateCode: this.BizTemplateCode });
  }
}
