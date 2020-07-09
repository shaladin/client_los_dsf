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

  ReturnHandlingForm = this.fb.group({
    MrReturnTaskCode: ['', [Validators.required, Validators.maxLength(50)]],
    ReturnHandlingNotes: ['', Validators.maxLength(4000)]
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
    });
  }

  async ngOnInit() : Promise<void> {
    this.lobCode = localStorage.getItem("BizTemplateCode");
    this.ClaimTask();
    this.arrValue.push(this.appId);
    await this.bindTaskObj();
    await this.getReturnHandling();
  }

  SubmitAll(){
    var reqObj = new ReturnHandlingHObj();
    reqObj.WfTaskListId = this.wfTaskListId;
    reqObj.ReturnHandlingHId = this.returnHandlingHId;

    this.http.post(AdInsConstant.ResumeReturnHandling, reqObj).subscribe(
      (response) => {
        console.log(response);
        this.toastr.successMessage(response["message"]);
        this.router.navigate(["/Nap/AddProcess/ReturnHandling/Paging"], { queryParams: { BizTemplateCode: this.lobCode } });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  // Test(){
  //   var reqObj = new ReturnHandlingHObj();
  //   reqObj.WfTaskListId = this.wfTaskListId;
  //   reqObj.ReturnHandlingHId = this.returnHandlingHId;

  //   this.http.post(AdInsConstant.Test, reqObj).subscribe(
  //     (response) => {
  //       console.log(response);
  //       this.toastr.successMessage(response["message"]);
  //       this.router.navigate(["../ReturnHandling/Paging"]);
  //     },
  //     (error) => {
  //       console.log(error);
  //     }
  //   );
  // }

  AddTask(){
    var reqObj = new ReturnHandlingDObj();
    reqObj.ReturnHandlingHId = this.returnHandlingHId;
    reqObj.MrReturnTaskCode = this.ReturnHandlingForm.controls.MrReturnTaskCode.value;
    reqObj.ReturnStat = CommonConstant.ReturnStatNew;
    reqObj.ReturnHandlingNotes = this.ReturnHandlingForm.controls.ReturnHandlingNotes.value;

    this.http.post(AdInsConstant.AddReturnHandlingD, reqObj).subscribe(
      (response) => {
        console.log(response);
        this.returnHandlingDObjs = response["ReturnHandlingDObjs"];
        this.toastr.successMessage(response["message"]); 
      },
      (error) => {
        console.log(error);
      }
    );
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

      this.http.post(AdInsConstant.RequestReturnTask, reqObj).subscribe(
        (response) => {
          console.log(response);
          this.returnHandlingDObjs = response["ReturnHandlingDObjs"];
          this.toastr.successMessage(response["message"]); 
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  Delete(item, i){
    if (confirm("Are you sure to delete this record?")) {
      var reqObj = new ReturnHandlingDObj();
      reqObj.ReturnHandlingDId = item.ReturnHandlingDId;
      reqObj.ReturnHandlingHId = this.returnHandlingHId;

      this.http.post(AdInsConstant.DeleteReturnHandlingD, reqObj).subscribe(
        (response) => {
          console.log(response);
          this.returnHandlingDObjs = response["ReturnHandlingDObjs"];
          this.toastr.successMessage(response["message"]); 
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  async getReturnHandling(){
    var reqObj = new ReturnHandlingHObj();
    reqObj.ReturnHandlingHId = this.returnHandlingHId;
    await this.http.post(AdInsConstant.GetReturnHandlingWithDetailByReturnHandlingHId, reqObj).toPromise().then(
      (response) => {
        console.log(response);
        this.returnHandlingHObj = response["ReturnHandlingHObj"];
        this.returnHandlingDObjs = response["ReturnHandlingDObjs"]; 
      },
      (error) => {
        console.log(error);
      }
    );
  }

  async bindTaskObj(){
    var refMasterObj = { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeReturnTask, ReserveField1: this.lobCode};
    await this.http.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, refMasterObj).toPromise().then(
      (response) => {
        this.taskObj = response["ReturnObject"];
        if(this.taskObj.length > 0){
          this.ReturnHandlingForm.patchValue({
            MrReturnTaskCode: this.taskObj[0].Key
          });
        }
      }
    );
  }

  ClaimTask(){
    var currentUserContext = JSON.parse(localStorage.getItem("UserAccess"));
    var wfClaimObj = new ClaimWorkflowObj();
    wfClaimObj.pWFTaskListID = this.wfTaskListId.toString();
    wfClaimObj.pUserID = currentUserContext["UserName"];

    this.http.post(AdInsConstant.ClaimTask, wfClaimObj).subscribe(
      (response) => {
    
      });
  }
}
