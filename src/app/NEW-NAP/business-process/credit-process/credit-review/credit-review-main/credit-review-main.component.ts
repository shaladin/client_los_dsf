import { Component, OnInit } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { environment } from 'environments/environment';
import { AppCrdRvwHObj } from 'app/shared/model/AppCrdRvwHObj.Model';
import { AppCrdRvwDObj } from 'app/shared/model/AppCrdRvwDObj.Model';
import { ReturnHandlingDObj } from 'app/shared/model/ReturnHandling/ReturnHandlingDObj.Model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';

@Component({
  selector: 'app-credit-review-main',
  templateUrl: './credit-review-main.component.html',
  styleUrls: []
})
export class CreditReviewMainComponent implements OnInit {

  appId: number = 0;
  ManualDeviationData;
  isExistedManualDeviationData;
  apvBaseUrl = environment.ApprovalR3Url;
  indentifierReason;
  indentifierApprover;
  TaskId: number = 0;
  ReturnHandlingHId: number = 0;
  ReturnHandlingDId: number = 0;
  show: boolean = false;

  HandlingForm = this.fb.group({
    ReturnHandlingNotes: [''],
    ReturnHandlingExecNotes: [''],
  });

  constructor(
    private route: ActivatedRoute, 
    private http: HttpClient, 
    private fb: FormBuilder,
    private toastr: NGXToastrService) { 
      this.route.queryParams.subscribe(params => {
        this.appId = params["AppId"];
        this.TaskId =params["TaskId"];
        this.ReturnHandlingHId = params["ReturnHandlingHId"];
        this.ReturnHandlingDId = params["ReturnHandlingDId"];
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
  

  InitData(){
    this.DDLReason = new Array();
    this.AppStep = {
      "CUST": 0,
      "APP": 1,
      "FRD": 2,
      "DEVC": 3,
      "APV": 4,
    };
    this.AppStepIndex = 0;
    this.CustTypeCode = "";
    this.Arr = this.FormObj.get('arr') as FormArray;
    console.log(this.Arr);
    this.UserAccess = JSON.parse(localStorage.getItem("UserAccess"));
    this.ManualDeviationData = new Array();
    this.isExistedManualDeviationData = false;

    if(this.ReturnHandlingDId!=0){
      this.show = true;
    }
  }

  viewProdMainInfoObj;
  AppStepIndex;
  AppStep;
  CustTypeCode;
  Arr;
  UserAccess;
  ResponseExistCreditReview;
  DDLReason;
  async ngOnInit() {    
    console.log("User Access");
    console.log(JSON.parse(localStorage.getItem("UserAccess")));
    this.InitData();
    this.viewProdMainInfoObj = "./assets/ucviewgeneric/viewNapAppMainInformation.json";
    await this.GetMouCustData();
    await this.BindDDLReason();
    await this.BindCreditAnalysisItemFormObj();
    await this.BindAppvAmt();
    await this.GetExistingCreditReviewData();
  }

  async GetMouCustData(){
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

  async BindCreditAnalysisItemFormObj(){
    var refMasterObj = { RefMasterTypeCode: "CRD_RVW_ANALYSIS_ITEM"};
    await this.http.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, refMasterObj).toPromise().then(
      (response) => {
        console.log(response);
        var temp = response[AdInsConstant.ReturnObj];
        for(var i=0;i<temp.length;i++){
          var NewDataForm = this.fb.group({
            QuestionCode: temp[i].Key,
            Question: temp[i].Value,
            Answer: ""
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

  async BindAppvAmt(){
    var Obj = { AppId: this.appId};
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

  async GetExistingCreditReviewData(){
    var Obj = { appCrdRvwHObj: { AppId: this.appId } };
    await this.http.post(AdInsConstant.GetAppCrdRvwById, Obj).toPromise().then(
      (response) => {
        console.log(response);  
        this.ResponseExistCreditReview = response["appCrdRvwHObj"];
        for(var i=0;i<this.ResponseExistCreditReview.appCrdRvwDObjs.length;i++){
          var idx = this.Arr.value.indexOf(this.Arr.value.find(x => x.QuestionCode == this.ResponseExistCreditReview.appCrdRvwDObjs[i].MrAnalysisItemCode));
          this.Arr.controls[idx].patchValue({
            Answer: this.ResponseExistCreditReview.appCrdRvwDObjs[i].AnalysisResult
          });
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  async BindDDLReason(){
    var Obj = { RefReasonTypeCode: "CRD_REVIEW" };
    await this.http.post(AdInsConstant.GetListActiveRefReason, Obj).toPromise().then(
      (response) => {
        console.log(response);   
        this.DDLReason = response[AdInsConstant.ReturnObj];   
        // console.log(this.DDLReason);   
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onChangeReason(ev){
    // console.log(ev);
    this.FormObj.patchValue({
      ReasonDesc: ev.target.selectedOptions[0].text
    });
    console.log(this.FormObj);
  }

  onChangeApprover(ev){
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

  SaveForm(){
    var temp = this.FormObj.value;
    // console.log(temp);
    var tempAppCrdRvwObj = new AppCrdRvwHObj();
    tempAppCrdRvwObj.AppId = this.appId;
    tempAppCrdRvwObj.SubmitDt = this.UserAccess.BusinessDt;
    tempAppCrdRvwObj.CrdRvwStat = "DONE";
    tempAppCrdRvwObj.ReturnNotes = "";
    if(this.ResponseExistCreditReview != null){
      tempAppCrdRvwObj.RowVersion = this.ResponseExistCreditReview.RowVersion;
    }
    tempAppCrdRvwObj.appCrdRvwDObjs = this.BindAppCrdRvwDObj(temp.arr);
    console.log(tempAppCrdRvwObj);

    var apiObj = {
      appCrdRvwHObj: tempAppCrdRvwObj,
      ApprovedById: temp.Approver,
      Reason: temp.Reason,
      Notes: temp.Notes,
      RowVersion: ""
    }
    console.log(apiObj);
    this.http.post(AdInsConstant.AddOrEditAppCrdRvwData, apiObj).subscribe(
      (response) => {
        console.log(response);    
      },
      (error) => {
        console.log(error);
      }
    );

    this.SaveManualDeviationData();
    if(this.ReturnHandlingDId != 0)
      this.EditReturnHandling();
  }
    
  EditReturnHandling(){
    var object = new ReturnHandlingDObj();
    object.AppId = this.appId;
    object.ReturnHandlingDId=this.ReturnHandlingDId;
    object.ReturnHandlingHId = this.ReturnHandlingHId;
    object.WfTaskListId = this.TaskId;
    object.ReturnHandlingNotes = this.HandlingForm.controls.ReturnHandlingNotes.value;
    object.ReturnHandlingExecNotes = this.HandlingForm.controls.ReturnHandlingExecNotes.value;
    object.ReturnStat ="REQ";
    object.MrReturnTaskCode = "RTN_EDIT_COM_RSV_FND";

    
    this.http.post(AdInsConstant.EditReturnHandlingD, object).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
      },
      (error) => {
        console.log(error);
      }
    );
  }
  
  SaveManualDeviationData(){
    if(this.isExistedManualDeviationData){
      var obj = {
        AppId: this.appId,
        ListDeviationResultObjs: this.ManualDeviationData
      }
  
      this.http.post(AdInsConstant.AddListManualDeviationResultByAppId, obj).subscribe(
        (response) => {
          console.log(response);    
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  BindAppCrdRvwDObj(objArr){
    var AppCrdRvwDObjs = new Array();
    // console.log(objArr);
    for(var i=0;i<objArr.length;i++){
      var temp = new AppCrdRvwDObj();
      temp.MrAnalysisItemCode = objArr[i].QuestionCode;
      temp.AnalysisResult = objArr[i].Answer;
      if(this.ResponseExistCreditReview != null){
        var idx = this.ResponseExistCreditReview.appCrdRvwDObjs.indexOf(this.ResponseExistCreditReview.appCrdRvwDObjs.find(x => x.MrAnalysisItemCode == objArr[i].QuestionCode));
        temp.RowVersion = this.ResponseExistCreditReview.appCrdRvwDObjs[idx].RowVersion;
      }
      AppCrdRvwDObjs.push(temp);
    }
    return AppCrdRvwDObjs;
  }

  CheckDeviationData(){
    console.log(this.ManualDeviationData);
  }

  BindManualDeviationData(ev){
    // console.log(ev);
    this.ManualDeviationData = ev;
    this.isExistedManualDeviationData = true;
  }
}
