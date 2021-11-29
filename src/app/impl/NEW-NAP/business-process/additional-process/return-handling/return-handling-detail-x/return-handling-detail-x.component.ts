import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { CookieService } from 'ngx-cookie';
import { ClaimTaskService } from 'app/shared/claimTask.service';
import { environment } from 'environments/environment';
import { CommonConstantX } from 'app/impl/shared/constant/CommonConstantX';
import { ReturnHandlingHObj } from 'app/shared/model/return-handling/return-handling-h-obj.model';
import { ReturnHandlingDObj } from 'app/shared/model/return-handling/return-handling-d-obj.model';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { UcViewGenericObj } from 'app/shared/model/uc-view-generic-obj.model';
import { ReqDeleteReturnHandlingDObj } from 'app/shared/model/return-handling/req-delete-return-handling-d-obj.model';
import { ReqRefMasterByTypeCodeAndMappingCodeObj } from 'app/shared/model/ref-master/req-ref-master-by-type-code-and-mapping-code-obj.model';

@Component({
  selector: 'app-return-handling-detail-x',
  templateUrl: './return-handling-detail-x.component.html'
})
export class ReturnHandlingDetailXComponent implements OnInit {
  appId: number;
  returnHandlingHId: number;
  wfTaskListId: any;
  lobCode: string;
  viewObj: string;
  returnHandlingHObj: ReturnHandlingHObj;
  returnHandlingDObjs: Array<ReturnHandlingDObj>;
  taskObj: Array<KeyValueObj>;
  MrCustTypeCode: string;
  IsViewReady: boolean = false;
  
  ReturnHandlingForm = this.fb.group({
    MrReturnTaskCode: ['', [Validators.required, Validators.maxLength(50)]],
    ReturnHandlingNotes: ['', [Validators.required, Validators.maxLength(4000)]]
  });

  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();

  readonly CancelLink: string = NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_PAGING;
  constructor(private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private cookieService: CookieService,
    private claimTaskService: ClaimTaskService) {
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
      if (params["MrCustTypeCode"] != null) {
        this.MrCustTypeCode = params["MrCustTypeCode"];
      }
    });
  }

  async ngOnInit(): Promise<void> {
    this.lobCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);
    if(this.lobCode === CommonConstant.OPL) {
      await this.SetMainInfo();
    }
    this.IsViewReady = true;
    this.ClaimTask()
    await this.bindTaskObj();
    await this.getReturnHandling();
  }

  async SetMainInfo() {
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/opl/view-opl-main-info.json";
  }

  SubmitAll() {
    var reqObj = new ReturnHandlingHObj();
    reqObj.WfTaskListId = this.wfTaskListId;
    reqObj.ReturnHandlingHId = this.returnHandlingHId;

    let ResumeReturnHandlingUrl = environment.isCore ? URLConstant.ResumeReturnHandlingV2 : URLConstant.ResumeReturnHandling;
    this.http.post(ResumeReturnHandlingUrl, reqObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        AdInsHelper.RedirectUrl(this.router, [this.CancelLink], { BizTemplateCode: this.lobCode });
      }
    );
  }

  AddTask() {
    var reqObj = new ReturnHandlingDObj();
    reqObj.ReturnHandlingHId = this.returnHandlingHId;
    reqObj.MrReturnTaskCode = this.ReturnHandlingForm.controls.MrReturnTaskCode.value;
    reqObj.ReturnStat = CommonConstant.ReturnStatNew;
    reqObj.ReturnHandlingNotes = this.ReturnHandlingForm.controls.ReturnHandlingNotes.value;

    this.http.post(URLConstant.AddReturnHandlingD, reqObj).subscribe(
      (response) => {
        this.GetListReturnHandlingDByReturnHandlingHId();
        this.toastr.successMessage(response["message"]);
      }
    );
  }

  Submit(item, i) {
    if (confirm("Are you sure to submit this record?")) {
      var reqObj = new ReturnHandlingDObj();
      reqObj.ReturnHandlingDId = item.ReturnHandlingDId;
      reqObj.ReturnHandlingHId = this.returnHandlingHId;
      reqObj.ReturnStat = CommonConstant.ReturnStatRequest;
      reqObj.MrReturnTaskCode = item.MrReturnTaskCode;
      reqObj.AppId = this.appId;
      reqObj.RowVersion = item.RowVersion;

      let RequestReturnTaskUrl = environment.isCore ? URLConstant.RequestReturnTaskV2 : URLConstant.RequestReturnTask;
      this.http.post(RequestReturnTaskUrl, reqObj).subscribe(
        (response) => {
          this.GetListReturnHandlingDByReturnHandlingHId();
          this.toastr.successMessage(response["message"]);
        }
      );
    }
  }

  Delete(item, i) {
    if (confirm(ExceptionConstant.DELETE_CONFIRMATION)) {
      var reqObj = new ReqDeleteReturnHandlingDObj();
      reqObj.ReturnHandlingDId = item.ReturnHandlingDId;
      reqObj.ReturnHandlingHId = this.returnHandlingHId;

      this.http.post(URLConstant.DeleteReturnHandlingD, reqObj).subscribe(
        (response) => {
          this.GetListReturnHandlingDByReturnHandlingHId();
          this.toastr.successMessage(response["message"]);
        }
      );
    }
  }

  async GetListReturnHandlingDByReturnHandlingHId() {
    var reqObj = new ReturnHandlingHObj();
    reqObj.Id = this.returnHandlingHId;
    await this.http.post(URLConstant.GetListReturnHandlingDByReturnHandlingHId, reqObj).toPromise().then(
      (response) => {
        this.returnHandlingDObjs = response["ReturnHandlingDObjs"] == null ? new Array() : response["ReturnHandlingDObjs"];
      });
  }

  async getReturnHandling() {
    var reqObj = new ReturnHandlingHObj();
    reqObj.Id = this.returnHandlingHId;
    await this.http.post(URLConstant.GetReturnHandlingWithDetailByReturnHandlingHId, reqObj).toPromise().then(
      (response) => {
        this.returnHandlingHObj = response["ReturnHandlingHObj"];
        this.returnHandlingDObjs = response["ReturnHandlingDObjs"] == null ? new Array() : response["ReturnHandlingDObjs"];
        if (this.returnHandlingHObj.ReturnFromTrxType == CommonConstant.TrxTypeCodePhn) {
          this.ReturnHandlingForm.patchValue({
            MrReturnTaskCode: CommonConstant.ReturnHandlingEditApp
          });
          this.ReturnHandlingForm.controls["MrReturnTaskCode"].disable();
        }else if (this.returnHandlingHObj.ReturnFromTrxType == CommonConstant.VerfTrxTypeCodeInvoice) {
          this.ReturnHandlingForm.patchValue({
            MrReturnTaskCode: this.taskObj[0].Key
          });

        }else if(this.returnHandlingHObj.ReturnFromTrxType == CommonConstant.AppStepComm || this.returnHandlingHObj.ReturnFromTrxType == CommonConstant.AppStepRSVFund){        
          this.taskObj = this.taskObj.filter(x => x.Key == CommonConstant.ReturnHandlingEditApp || x.Key == CommonConstantX.ReturnHandlingAddSurveyVerf);

          if (this.taskObj.length > 0) {
            this.ReturnHandlingForm.patchValue({
              MrReturnTaskCode: this.taskObj[0].Key
            });
          }
        }else if (this.returnHandlingHObj.ReturnFromTrxType == CommonConstantX.APP_STEP_SURVEY_VERIF) {
          this.ReturnHandlingForm.patchValue({
            MrReturnTaskCode: CommonConstant.ReturnHandlingEditApp
          });
          this.ReturnHandlingForm.controls["MrReturnTaskCode"].disable();
        }
      }
    );
  }

  async bindTaskObj() {
    let refMasterTypeCode = '';
    switch (this.lobCode) {
      case CommonConstant.CF4W:
        refMasterTypeCode = CommonConstant.RefMasterTypeCodeReturnTaskCF4W;
        break;
      case CommonConstant.CFNA:
        refMasterTypeCode = CommonConstant.RefMasterTypeCodeReturnTaskCFNA;
        break;
      case CommonConstant.CFRFN4W:
        refMasterTypeCode = CommonConstant.RefMasterTypeCodeReturnTaskCFRFN4W;
        break;
      case CommonConstant.FL4W:
        refMasterTypeCode = CommonConstant.RefMasterTypeCodeReturnTaskFL4W;
        break;
      case CommonConstant.OPL:
        refMasterTypeCode = CommonConstant.RefMasterTypeCodeReturnTaskOPL;
        break;
      case CommonConstant.FCTR:
        refMasterTypeCode = CommonConstant.RefMasterTypeCodeReturnTaskFCTR;
        break;
      case CommonConstant.DF:
      refMasterTypeCode = CommonConstant.RefMasterTypeCodeReturnTaskDF;
        break;
    }
    if (!refMasterTypeCode) return;

    let refMasterObj: ReqRefMasterByTypeCodeAndMappingCodeObj = { RefMasterTypeCode: refMasterTypeCode, MappingCode: this.MrCustTypeCode };
    await this.http.post(URLConstant.GetListActiveRefMasterWithMappingCodeAll, refMasterObj).toPromise().then(
      (response) => {
        this.taskObj = response[CommonConstant.ReturnObj];
        if (this.taskObj.length > 0) {
          this.ReturnHandlingForm.patchValue({
            MrReturnTaskCode: this.taskObj[0].Key
          });
        }
      }
    );
  }

  GetCallBack(event: any) {
    if(event.Key === "Application") {
      AdInsHelper.OpenAppViewByAppId(event.ViewObj.AppId);
    }
    else if (event.Key === "ProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(event.ViewObj.ProdOfferingCode, event.ViewObj.ProdOfferingVersion);
    }
  }

  ClaimTask(){
    if (environment.isCore) {
      if (this.wfTaskListId != "" && this.wfTaskListId != undefined) {
        this.claimTaskService.ClaimTaskV2(this.wfTaskListId);
      }
    }
    else if (this.wfTaskListId > 0) {
      this.claimTaskService.ClaimTask(this.wfTaskListId);
    }
  }
}
