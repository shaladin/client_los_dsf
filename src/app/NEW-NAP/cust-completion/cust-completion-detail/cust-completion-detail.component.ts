import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { InputGridObj } from 'app/shared/model/input-grid-obj.model';
import { ReturnHandlingDObj } from 'app/shared/model/return-handling/return-handling-d-obj.model';
import { UcViewGenericObj } from 'app/shared/model/uc-view-generic-obj.model';
import { FormBuilder } from '@angular/forms';
import { SubmitNapObj } from 'app/shared/model/generic/submit-nap-obj.model';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { ResReturnHandlingDObj } from 'app/shared/model/response/return-handling/res-return-handling-d-obj.model';
import { ClaimTaskService } from 'app/shared/claimTask.service';
import { AppCustCompletionObj } from 'app/shared/model/cust-completion/app-cust-completion-obj.model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-cust-completion-detail',
  templateUrl: './cust-completion-detail.component.html',
  styleUrls: ['./cust-completion-detail.component.scss']
})
export class CustCompletionDetailComponent implements OnInit {
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  inputGridObj: InputGridObj = new InputGridObj();
  listCustCompletion: Array<AppCustCompletionObj> = new Array();
  AppId: number;
  wfTaskListId: any;
  BizTemplateCode: string;
  addObj: object = {};
  FormReturnObj = this.fb.group({
    ReturnExecNotes: ['']
  });
  ReturnHandlingHId: number = 0;
  ResponseReturnInfoObj: ResReturnHandlingDObj = new ResReturnHandlingDObj();
  OnFormReturnInfo: boolean = false;
  IsDataReady: boolean = false;
  IsCustAllowedContinue: boolean = true;
  
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private toastr: NGXToastrService, 
    private fb: FormBuilder,
    private cookieService: CookieService,
    private claimTaskService: ClaimTaskService) {
    this.route.queryParams.subscribe(params => {
      if (params['AppId'] != null) {
        this.AppId = params['AppId'];
      }
      if (params["WfTaskListId"] != null) {
        this.wfTaskListId = params["WfTaskListId"];
      }
      if (params["BizTemplateCode"] != null) {
        this.BizTemplateCode = params["BizTemplateCode"];
        localStorage.setItem(CommonConstant.BIZ_TEMPLATE_CODE, this.BizTemplateCode);
      }
      if (params["ReturnHandlingHId"] != null) {
        this.ReturnHandlingHId = params["ReturnHandlingHId"];
      }
    });
  }

  async ngOnInit() {
    this.BizTemplateCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE)
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewCustCompletionData.json";

    this.inputGridObj = new InputGridObj();
    if (this.ReturnHandlingHId != 0) {
      this.inputGridObj.pagingJson = "./assets/ucgridview/gridCustCompletionDataRtn.json";
      this.MakeViewReturnInfoObj();
      this.addObj["ReturnHandlingHId"] = this.ReturnHandlingHId;
    }
    else {
      this.inputGridObj.pagingJson = "./assets/ucgridview/gridCustCompletionData.json";
      await this.checkIsCustAllowedContinue();
    }
    this.addObj["WfTaskListId"] = this.wfTaskListId;
    this.addObj["BizTemplateCode"] = this.BizTemplateCode;

    this.loadCustCompletionListData();
    this.claimTask();

    this.IsDataReady = true;
  }

  MakeViewReturnInfoObj() {
    if (this.ReturnHandlingHId > 0) {
      let ReqByIdAndCodeObj = new GenericObj();
      ReqByIdAndCodeObj.Id = this.ReturnHandlingHId;
      ReqByIdAndCodeObj.Code = CommonConstant.ReturnHandlingEditNAP4;
      this.http.post(URLConstant.GetLastReturnHandlingDByReturnHandlingHIdAndMrReturnTaskCode, ReqByIdAndCodeObj).subscribe(
        (response : ResReturnHandlingDObj) => {
          this.ResponseReturnInfoObj = response;
          this.FormReturnObj.patchValue({
            ReturnExecNotes: this.ResponseReturnInfoObj.ReturnHandlingExecNotes
          });
          this.OnFormReturnInfo = true;
        });
    }
  }

  loadCustCompletionListData() {
    this.http.post(URLConstant.GetListAppCustCompletion, { Id: this.AppId }).subscribe(
      (response) => {
        this.inputGridObj.resultData = {
          Data: ""
        }
        this.inputGridObj.resultData["Data"] = new Array();
        this.inputGridObj.resultData.Data = response[CommonConstant.ReturnObj];
        this.listCustCompletion = this.inputGridObj.resultData.Data;
      }
    );
  }

  buttonBackOnClick() {
    let url: string = NavigationConstant.NAP_CUST_COMPL_PAGING
    if(this.ReturnHandlingHId > 0){
      url = NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_NAP4_PAGING;
    }
    AdInsHelper.RedirectUrl(this.router, [url], { BizTemplateCode: this.BizTemplateCode });
  }

  buttonSubmitOnClick() {
    let reqObj: SubmitNapObj = new SubmitNapObj();
    reqObj.AppId = this.AppId;
    reqObj.WfTaskListId = this.wfTaskListId;
    
    let SubmitAppCustCompletionUrl = environment.isCore ? URLConstant.SubmitAppCustCompletionV21 : URLConstant.SubmitAppCustCompletion;
    this.http.post(SubmitAppCustCompletionUrl, reqObj).subscribe(
      response => {
        this.toastr.successMessage(response["Message"]);
        this.buttonBackOnClick();
      }
    );
  }

  GetCallback(event) {
    AdInsHelper.OpenProdOfferingViewByCodeAndVersion(event.ViewObj.ProdOfferingCode, event.ViewObj.ProdOfferingVersion);
  }

  Submit() {
    if (this.ReturnHandlingHId > 0) {
      var ReturnHandlingResult: ReturnHandlingDObj = new ReturnHandlingDObj();
      ReturnHandlingResult.WfTaskListId = this.wfTaskListId;
      ReturnHandlingResult.ReturnHandlingHId = this.ResponseReturnInfoObj.ReturnHandlingHId;
      ReturnHandlingResult.ReturnHandlingDId = this.ResponseReturnInfoObj.ReturnHandlingDId;
      ReturnHandlingResult.MrReturnTaskCode = this.ResponseReturnInfoObj.MrReturnTaskCode;
      ReturnHandlingResult.ReturnStat = this.ResponseReturnInfoObj.ReturnStat;
      ReturnHandlingResult.ReturnHandlingNotes = this.ResponseReturnInfoObj.ReturnHandlingNotes;
      ReturnHandlingResult.ReturnHandlingExecNotes = this.FormReturnObj.controls['ReturnExecNotes'].value;
      ReturnHandlingResult.RowVersion = this.ResponseReturnInfoObj.RowVersion;

      let EditReturnHandlingDUrl = environment.isCore ? URLConstant.EditReturnHandlingDV2 : URLConstant.EditReturnHandlingD;
      this.http.post(EditReturnHandlingDUrl, ReturnHandlingResult).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_EDIT_APP_PAGING], { BizTemplateCode: this.BizTemplateCode });
        }
      )
    }
  }

  claimTask(){
    if(environment.isCore){
      if(this.wfTaskListId!= "" && this.wfTaskListId!= undefined){
        this.claimTaskService.ClaimTaskV2(this.wfTaskListId);
        }
    }
    else if (this.wfTaskListId> 0) {
        this.claimTaskService.ClaimTask(this.wfTaskListId);
    }
  }

  async checkIsCustAllowedContinue()
  {
    await this.http.post(URLConstant.CheckIsNegCustAllowedCreateAppByAppId, { Id: this.AppId }).toPromise().then(
      (res) => {
        if(res == undefined) this.IsCustAllowedContinue = false;
      }
    );
  }
}