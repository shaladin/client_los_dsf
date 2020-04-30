import { Component, OnInit, Input } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { environment } from 'environments/environment';
import { InputGridObj } from 'app/shared/model/InputGridObj.Model';
import { HttpClient } from '@angular/common/http';
import { GuarantorObj } from 'app/shared/model/GuarantorObj.Model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueModel';
import { RequestAppCrdInvstgObj } from 'app/shared/model/AppCrdInvstg/RequestAppCrdInvstgObj.Model';
import { AppCrdInvstgDObj } from 'app/shared/model/AppCrdInvstg/AppCrdInvstgDObj.Model';

@Component({
  selector: 'app-credit-investigation-detail',
  templateUrl: './credit-investigation-detail.component.html',
  styleUrls: []
})
export class CreditInvestigationDetailComponent implements OnInit {

  appId: number;
  mrCustTypeCode: string;
  viewObj: string;
  arrValue = [];
  analysisItemObj: Array<KeyValueObj>;
  type: string;

  CreditInvestigationForm = this.fb.group({
    AppCrdInvstgDs: new FormArray([]),
  });

  constructor(private fb: FormBuilder, 
    private http: HttpClient,
    private toastr: NGXToastrService,
    private route: ActivatedRoute,
    private router: Router) {
    this.route.queryParams.subscribe(params => {
      if (params["AppId"] != null) {
        this.appId = params["AppId"];
      }
      if (params["MrCustTypeCode"] != null) {
        this.mrCustTypeCode = params["MrCustTypeCode"];
      }
    });
  }
  async ngOnInit() : Promise<void> {
    this.arrValue.push(this.appId);
    this.viewObj = "./assets/ucviewgeneric/viewCreditInvestigationInfo.json";
    await this.bindAnalysisItemObj();
    this.generateFormAnalysisItem();
  }

  SaveForm(){
    var reqAppCrdInvstg = new RequestAppCrdInvstgObj();

    var user = JSON.parse(localStorage.getItem("UserAccess"));
    reqAppCrdInvstg.AppId = this.appId;
    reqAppCrdInvstg.AppCrdInvstgHObj.AppId = this.appId;
    reqAppCrdInvstg.AppCrdInvstgHObj.CrdInvstgStat = "DONE";
    reqAppCrdInvstg.AppCrdInvstgHObj.CrdRiskEmpNo = user.EmpNo;
    reqAppCrdInvstg.AppCrdInvstgHObj.SubmitDt = new Date();

    for(let i = 0; i < this.CreditInvestigationForm.controls["AppCrdInvstgDs"]["controls"].length; i++){
      var appCrdInvstgD = new AppCrdInvstgDObj();

      appCrdInvstgD.MrAnalysisItemCode = this.CreditInvestigationForm.controls["AppCrdInvstgDs"]["controls"][i]["controls"].MrAnalysisItemCode.value;
      appCrdInvstgD.AnalysisResult = this.CreditInvestigationForm.controls["AppCrdInvstgDs"]["controls"][i]["controls"].AnalysisResult.value;

      reqAppCrdInvstg.AppCrdInvstgHObj.AppCrdInvstgDObjs.push(appCrdInvstgD);
    }

    this.http.post(AdInsConstant.AddAppCrdInvstg, reqAppCrdInvstg).subscribe(
      (response) => {
        console.log(response);
        this.toastr.successMessage(response["message"]);
        this.router.navigate(["../CreditInvestigation/Paging"]);
      },
      (error) => {
        console.log(error);
      }
    );

  }

  EnterTab(type) {
    this.type = type;
  }

  generateFormAnalysisItem(){
    for(let i = 0; i < this.analysisItemObj.length; i++){
      (this.CreditInvestigationForm.controls.AppCrdInvstgDs as FormArray).push(this.addGroup(this.analysisItemObj[i]));
    }
  }

  addGroup(analysisItem){
    var group = this.fb.group({
      MrAnalysisItemCode: analysisItem.Key,
      AnalysisItemName: analysisItem.Value,
      AnalysisResult: ['', Validators.maxLength(4000)]
    });

    return group;
  }

  async bindAnalysisItemObj(){
    var refMasterObj = { RefMasterTypeCode: "CRD_INVSTG_ANALYSIS_ITEM"};
    await this.http.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, refMasterObj).toPromise().then(
      (response) => {
        this.analysisItemObj = response["ReturnObject"];
      }
    );
  }
}
