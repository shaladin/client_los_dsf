import { Component, OnInit, Input } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueModel';
import { ReturnHandlingHObj } from 'app/shared/model/ReturnHandling/ReturnHandlingHObj.Model';
import { ReturnHandlingDObj } from 'app/shared/model/ReturnHandling/ReturnHandlingDObj.Model';
import { ClaimWorkflowObj } from 'app/shared/model/Workflow/ClaimWorkflowObj.Model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';

@Component({
  selector: 'app-return-handling-detail',
  templateUrl: './return-handling-detail.component.html',
  styleUrls: []
})
export class ReturnHandlingDetailComponent implements OnInit {

  appId: number;
  returnHandlingHId: number;
  wfTaskListId: number;
  lobCode: string;
  viewObj: string;
  arrValue = [];
  returnHandlingHObj: ReturnHandlingHObj;
  returnHandlingDObjs: Array<ReturnHandlingDObj>;
  taskObj: Array<KeyValueObj>;
  MrCustTypeCode : string;
  ReturnHandlingForm = this.fb.group({
    MrReturnTaskCode: ['', [Validators.required, Validators.maxLength(50)]],
    ReturnHandlingNotes: ['',[Validators.required, Validators.maxLength(4000)]]
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
      if (params["ReturnHandlingHId"] != null) {
        this.returnHandlingHId = params["ReturnHandlingHId"];
      }
      if (params["WfTaskListId"] != null) {
        this.wfTaskListId = params["WfTaskListId"];
      }
      if(params["MrCustTypeCode"] != null){
        this.MrCustTypeCode = params["MrCustTypeCode"];
      }
    });
  }

  async ngOnInit() : Promise<void> {
    this.lobCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);
    this.ClaimTask();
    this.arrValue.push(this.appId);
    await this.bindTaskObj();
    await this.getReturnHandling();
  }

  SubmitAll(){
    var reqObj = new ReturnHandlingHObj();
    reqObj.WfTaskListId = this.wfTaskListId;
    reqObj.ReturnHandlingHId = this.returnHandlingHId;

    this.http.post(URLConstant.ResumeReturnHandling, reqObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        AdInsHelper.RedirectUrl(this.router,["/Nap/AddProcess/ReturnHandling/Paging"], { BizTemplateCode: this.lobCode });
      });
  }

  AddTask(){
    var reqObj = new ReturnHandlingDObj();
    reqObj.ReturnHandlingHId = this.returnHandlingHId;
    reqObj.MrReturnTaskCode = this.ReturnHandlingForm.controls.MrReturnTaskCode.value;
    reqObj.ReturnStat = CommonConstant.ReturnStatNew;
    reqObj.ReturnHandlingNotes = this.ReturnHandlingForm.controls.ReturnHandlingNotes.value;

    this.http.post(URLConstant.AddReturnHandlingD, reqObj).subscribe(
      (response) => {
        this.returnHandlingDObjs = response["ReturnHandlingDObjs"];
        this.toastr.successMessage(response["message"]); 
      });
  }

  Submit(item, i){
    if (confirm("Are you sure to submit this record?")) {
      var reqObj = new ReturnHandlingDObj();
      reqObj.ReturnHandlingDId = item.ReturnHandlingDId;
      reqObj.ReturnHandlingHId = this.returnHandlingHId;
      reqObj.ReturnStat = CommonConstant.ReturnStatRequest;
      reqObj.MrReturnTaskCode = item.MrReturnTaskCode;
      reqObj.AppId = this.appId;
      reqObj.RowVersion = item.RowVersion;

      this.http.post(URLConstant.RequestReturnTask, reqObj).subscribe(
        (response) => {
          this.returnHandlingDObjs = response["ReturnHandlingDObjs"];
          this.toastr.successMessage(response["message"]); 
        });
    }
  }

  Delete(item, i){
    if (confirm(ExceptionConstant.DELETE_CONFIRMATION)) {
      var reqObj = new ReturnHandlingDObj();
      reqObj.ReturnHandlingDId = item.ReturnHandlingDId;
      reqObj.ReturnHandlingHId = this.returnHandlingHId;

      this.http.post(URLConstant.DeleteReturnHandlingD, reqObj).subscribe(
        (response) => {
          this.returnHandlingDObjs = response["ReturnHandlingDObjs"];
          this.toastr.successMessage(response["message"]); 
        });
    }
  }

  async getReturnHandling(){
    var reqObj = new ReturnHandlingHObj();
    reqObj.ReturnHandlingHId = this.returnHandlingHId;
    await this.http.post(URLConstant.GetReturnHandlingWithDetailByReturnHandlingHId, reqObj).toPromise().then(
      (response) => {
        this.returnHandlingHObj = response["ReturnHandlingHObj"];
        this.returnHandlingDObjs = response["ReturnHandlingDObjs"];
        if (this.returnHandlingHObj.ReturnFromTrxType == CommonConstant.TrxTypeCodePhn) {
          this.ReturnHandlingForm.patchValue({
            MrReturnTaskCode: "RTN_EDIT_APP"
          });
          this.ReturnHandlingForm.controls["MrReturnTaskCode"].disable();
        }
      });
  }

  async bindTaskObj(){
    let refMasterTypeCode = '';
    switch(this.lobCode){
      case CommonConstant.CF4W :
        refMasterTypeCode = CommonConstant.RefMasterTypeCodeReturnTaskCF4W;
        break;
      case CommonConstant.CFNA :
        refMasterTypeCode = CommonConstant.RefMasterTypeCodeReturnTaskCFNA;
        break;
      case CommonConstant.CFRFN4W :
        refMasterTypeCode = CommonConstant.RefMasterTypeCodeReturnTaskCFRFN4W;
        break;
      case CommonConstant.FL4W :
        refMasterTypeCode = CommonConstant.RefMasterTypeCodeReturnTaskFL4W;    
        break;
    }
    if(!refMasterTypeCode) return;
    
    var refMasterObj = { RefMasterTypeCode: refMasterTypeCode, MappingCode: this.MrCustTypeCode};
    await this.http.post(URLConstant.GetListActiveRefMasterWithMappingCodeAll, refMasterObj).toPromise().then(
      (response) => {
        this.taskObj = response[CommonConstant.ReturnObj];
        if(this.taskObj.length > 0){
          this.ReturnHandlingForm.patchValue({
            MrReturnTaskCode: this.taskObj[0].Key
          });
        }
      }
    );
  }

  ClaimTask(){
    var currentUserContext = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));
    var wfClaimObj = new ClaimWorkflowObj();
    wfClaimObj.pWFTaskListID = this.wfTaskListId.toString();
    wfClaimObj.pUserID = currentUserContext[CommonConstant.USER_NAME];

    this.http.post(URLConstant.ClaimTask, wfClaimObj).subscribe(
      (response) => {
    
      });
  }
}
