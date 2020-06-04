import { Component, OnInit } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { environment } from 'environments/environment';
import { AppCrdRvwHObj } from 'app/shared/model/AppCrdRvwHObj.Model';
import { AppCrdRvwDObj } from 'app/shared/model/AppCrdRvwDObj.Model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ClaimWorkflowObj } from 'app/shared/model/Workflow/ClaimWorkflowObj.Model';
import { ScoringResultHObj } from 'app/shared/model/ScoringResultHObj.Model';
import { NapAppModel } from 'app/shared/model/NapApp.Model';

@Component({
  selector: 'app-credit-review-main',
  templateUrl: './credit-review-main.component.html',
  styleUrls: []
})
export class CreditReviewMainComponent implements OnInit {

  appId: number = 0;
  wfTaskListId: number;
  ManualDeviationData;
  isExistedManualDeviationData;
  apvBaseUrl = environment.ApprovalR3Url;
  indentifierReason;
  indentifierApprover;
  ReturnHandlingHId: number = 0;
  ReturnHandlingDId: number = 0;
  BizTemplateCode: string = "";

  // ReturnForm = this.fb.group({
  //   ReturnReason: [''],
  //   ReturnReasonDesc: [''],
  //   ReturnExecNotes: [''],
  // });

  constructor(
    private route: ActivatedRoute, 
    private http: HttpClient, 
    private fb: FormBuilder,
    private router: Router) { 
      this.route.queryParams.subscribe(params => {
        this.appId = params["AppId"];
        if (params["WfTaskListId"] != null) {
          this.wfTaskListId = params["WfTaskListId"];
        }
      });
    }
  
  FormObj = this.fb.group({
    arr: this.fb.array([]),
    AppvAmt: [''],
    CreditScoring: [''],
    Reason: ['', Validators.required],
    ReasonDesc: [""],
    Approver: ['', Validators.required],
    ApproverDesc: [""],
    Notes: ['', Validators.required]
  });


  InitData() {
    this.BizTemplateCode = localStorage.getItem("BizTemplateCode")
    this.DDLRecommendation = new Array();
    this.DDLReasonReturn = new Array();
    this.AppStepIndex = 0;
    this.CustTypeCode = "";
    this.Arr = this.FormObj.get('arr') as FormArray;
    console.log(this.Arr);
    this.UserAccess = JSON.parse(localStorage.getItem("UserAccess"));
    this.ManualDeviationData = new Array();
    this.isExistedManualDeviationData = false;
    this.isReturnOn = false;
  }

  viewProdMainInfoObj;
  AppStepIndex: number = 0;
  AppStep = {
    "CUST": 0,
    "APP": 1,
    "FRD": 2,
    "DEVC": 3,
    "APV": 4,
  };
  CustTypeCode;
  Arr;
  UserAccess;
  ResponseExistCreditReview;
  DDLRecommendation;
  DDLReasonReturn;
  async ngOnInit() {
    this.ClaimTask();
    console.log("User Access");
    console.log(JSON.parse(localStorage.getItem("UserAccess")));
    this.InitData();
    this.viewProdMainInfoObj = "./assets/ucviewgeneric/viewNapAppMainInformation.json";
    await this.GetAppNo();
    await this.GetAppCustData();
    await this.BindDDLRecommendation();
    await this.BindDDLReasonReturn();
    await this.BindCreditAnalysisItemFormObj();
    await this.BindAppvAmt();
    await this.GetExistingCreditReviewData();
  }

  async GetAppNo(){
    var obj = { AppId: this.appId };
    await this.http.post<NapAppModel>(AdInsConstant.GetAppById, obj).toPromise().then(
      (response) => {
        console.log(response);
        if(response != undefined)
          this.GetCreditScoring(response["AppNo"]);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  GetCreditScoring(appNo: string){
    var obj = { ScoringResultH: { TrxSourceNo: appNo } };
    this.http.post(AdInsConstant.GetLatestScoringResultHByTrxSourceNo, obj).toPromise().then(
      (response) => {
        console.log(response);
        if(response["ScoringResultHObj"]!=null){
          var ScoringResult: ScoringResultHObj = response["ScoringResultHObj"];
          this.FormObj.patchValue({
            CreditScoring: ScoringResult.ScoringValue
          });
        }else{
          this.FormObj.patchValue({
            CreditScoring: "-"
          });
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  async GetAppCustData(){
    var obj = {
      AppId: this.appId,
      RowVersion: ""
    };

    await this.http.post(AdInsConstant.GetAppCustByAppId, obj).toPromise().then(
      (response) => {
        console.log(response);
        this.CustTypeCode = response["MrCustTypeCode"];
      },
      (error) => {
        console.log(error);
      }
    );
  }

  async BindCreditAnalysisItemFormObj() {
    var refMasterObj = { RefMasterTypeCode: "CRD_RVW_ANALYSIS_ITEM" };
    await this.http.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, refMasterObj).toPromise().then(
      (response) => {
        console.log(response);
        var temp = response[AdInsConstant.ReturnObj];
        for (var i = 0; i < temp.length; i++) {
          var NewDataForm = this.fb.group({
            QuestionCode: temp[i].Key,
            Question: temp[i].Value,
            Answer: ["", Validators.required]
          }) as FormGroup;
          this.Arr.push(NewDataForm);
        }
        console.log(this.FormObj);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  async BindAppvAmt() {
    var Obj = { AppId: this.appId };
    await this.http.post(AdInsConstant.GetAppFinDataByAppId, Obj).toPromise().then(
      (response) => {
        console.log(response);
        this.FormObj.patchValue({
          AppvAmt: response["ApvAmt"]
        });
        console.log(this.FormObj);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  async GetExistingCreditReviewData() {
    var Obj = { appCrdRvwHObj: { AppId: this.appId } };
    await this.http.post(AdInsConstant.GetAppCrdRvwById, Obj).toPromise().then(
      (response) => {
        console.log(response);
        this.ResponseExistCreditReview = response["appCrdRvwHObj"];
        if(this.ResponseExistCreditReview.appCrdRvwDObjs!=null){
          for(var i=0;i<this.ResponseExistCreditReview.appCrdRvwDObjs.length;i++){
            var idx = this.Arr.value.indexOf(this.Arr.value.find(x => x.QuestionCode == this.ResponseExistCreditReview.appCrdRvwDObjs[i].MrAnalysisItemCode));
            this.Arr.controls[idx].patchValue({
              Answer: this.ResponseExistCreditReview.appCrdRvwDObjs[i].AnalysisResult
            });
          }
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  async BindDDLRecommendation() {
    var Obj = { RefReasonTypeCode: "CRD_REVIEW" };
    await this.http.post(AdInsConstant.GetListActiveRefReason, Obj).toPromise().then(
      (response) => {
        console.log(response);
        this.DDLRecommendation = response[AdInsConstant.ReturnObj];
        // console.log(this.DDLRecommendation);   
      },
      (error) => {
        console.log(error);
      }
    );
  }

  async BindDDLReasonReturn() {
    var obj = { RefReasonTypeCode: "CRD_REVIEW" };
    await this.http.post(AdInsConstant.GetListActiveRefReasonByRefReasonTypeCode, obj).toPromise().then(
      (response) => {
        console.log(response);
        this.DDLReasonReturn = response[AdInsConstant.ReturnObj];
        console.log(this.DDLReasonReturn);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onChangeReason(ev) {
    // console.log(ev);
    this.FormObj.patchValue({
      ReasonDesc: ev.target.selectedOptions[0].text
    });
    console.log(this.FormObj);
  }

  onChangeApprover(ev) {
    console.log(ev);
    this.FormObj.patchValue({
      ApproverDesc: ev.target.selectedOptions[0].text
    });
    console.log(this.FormObj);
  }

  EnterTab(AppStep) {
    // console.log(AppStep);
    switch (AppStep) {
      case AdInsConstant.AppStepCust:
        this.AppStepIndex = this.AppStep[AdInsConstant.AppStepCust];
        break;
      case AdInsConstant.AppStepApp:
        this.AppStepIndex = this.AppStep[AdInsConstant.AppStepApp];
        break;
      case AdInsConstant.AppStepFraud:
        this.AppStepIndex = this.AppStep[AdInsConstant.AppStepFraud];
        break;
      case AdInsConstant.AppStepDev:
        this.AppStepIndex = this.AppStep[AdInsConstant.AppStepDev];
        break;
      case AdInsConstant.AppStepApv:
        this.AppStepIndex = this.AppStep[AdInsConstant.AppStepApv];
        break;

      default:
        break;
    }
  }

  SaveForm() {
    var temp = this.FormObj.value;
    // console.log(temp);
    var tempAppCrdRvwObj = new AppCrdRvwHObj();
    tempAppCrdRvwObj.AppId = this.appId;
    tempAppCrdRvwObj.SubmitDt = this.UserAccess.BusinessDt;
    tempAppCrdRvwObj.CrdRvwStat = "DONE";
    tempAppCrdRvwObj.ReturnNotes = "";
    if (this.ResponseExistCreditReview != null) {
      tempAppCrdRvwObj.RowVersion = this.ResponseExistCreditReview.RowVersion;
    }
    tempAppCrdRvwObj.appCrdRvwDObjs = this.BindAppCrdRvwDObj(temp.arr);
    console.log(tempAppCrdRvwObj);

    if (this.isReturnOn)
      temp.Approver = 0;

    var apiObj = {
      appCrdRvwHObj: tempAppCrdRvwObj,
      ApprovedById: temp.Approver,
      Reason: temp.Reason,
      Notes: temp.Notes,
      WfTaskListId: this.wfTaskListId,
      RowVersion: "",
      AppId: this.appId,
      ListDeviationResultObjs: this.ManualDeviationData
    }
    console.log(apiObj);
    this.http.post(AdInsConstant.AddOrEditAppCrdRvwDataAndListManualDeviationData, apiObj).subscribe(
      (response) => {
        console.log(response);    
        this.router.navigate(["/Nap/CreditProcess/CreditReview/Paging"], { queryParams: { "BizTemplateCode": this.BizTemplateCode, } });
      },
      (error) => {
        console.log(error);
      }
    );
  }
  
  BindAppCrdRvwDObj(objArr){
    var AppCrdRvwDObjs = new Array();
    // console.log(objArr);
    for (var i = 0; i < objArr.length; i++) {
      var temp = new AppCrdRvwDObj();
      temp.MrAnalysisItemCode = objArr[i].QuestionCode;
      temp.AnalysisResult = objArr[i].Answer;
      if(this.ResponseExistCreditReview.appCrdRvwDObjs != null){
        var idx = this.ResponseExistCreditReview.appCrdRvwDObjs.indexOf(this.ResponseExistCreditReview.appCrdRvwDObjs.find(x => x.MrAnalysisItemCode == objArr[i].QuestionCode));
        temp.AppCrdRvwDId = this.ResponseExistCreditReview.appCrdRvwDObjs[idx].AppCrdRvwDId;
        temp.RowVersion = this.ResponseExistCreditReview.appCrdRvwDObjs[idx].RowVersion;
      }
      AppCrdRvwDObjs.push(temp);
    }
    return AppCrdRvwDObjs;
  }

  CheckDeviationData() {
    console.log(this.ManualDeviationData);
  }

  BindManualDeviationData(ev){
    // console.log(ev);
    this.ManualDeviationData = ev;
    this.isExistedManualDeviationData = true;
  }

  isReturnOn;
  switchForm() {
    this.FormObj.patchValue({
      Reason: "",
      ReasonDesc: "",
      Notes: ""
    });
    console.log(this.FormObj);

    if (!this.isReturnOn) {
      this.isReturnOn = true;
      this.FormObj.controls.Approver.clearValidators();
    } else {
      this.isReturnOn = false;
      this.FormObj.controls.Approver.setValidators([Validators.required]);
    }
    this.FormObj.controls.Approver.updateValueAndValidity();

  }


  ClaimTask() {
    var currentUserContext = JSON.parse(localStorage.getItem("UserAccess"));
    var wfClaimObj = new ClaimWorkflowObj();
    wfClaimObj.pWFTaskListID = this.wfTaskListId.toString();
    wfClaimObj.pUserID = currentUserContext["UserName"];

    this.http.post(AdInsConstant.ClaimTask, wfClaimObj).subscribe(
      () => {
    
      });
  }
}
