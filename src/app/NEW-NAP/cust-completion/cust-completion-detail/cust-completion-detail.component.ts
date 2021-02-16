import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppObj } from 'app/shared/model/App/App.Model';
import { InputGridObj } from 'app/shared/model/InputGridObj.Model';
import { ReturnHandlingDObj } from 'app/shared/model/ReturnHandling/ReturnHandlingDObj.Model';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-cust-completion-detail',
  templateUrl: './cust-completion-detail.component.html',
  styleUrls: ['./cust-completion-detail.component.scss']
})
export class CustCompletionDetailComponent implements OnInit {
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  inputGridObj: InputGridObj = new InputGridObj();
  listCustCompletion: Array<any> = new Array();
  AppId: number;
  wfTaskListId: number;
  BizTemplateCode: string;
  addObj: any = {};
  FormReturnObj = this.fb.group({
    ReturnExecNotes: ['']
  });
  ReturnHandlingHId: number = 0;
  ResponseReturnInfoObj: ReturnHandlingDObj;
  OnFormReturnInfo: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
    private location: Location,
    private toastr: NGXToastrService) {
    this.route.queryParams.subscribe(params => {
      if (params['AppId'] != null) {
        this.AppId = params['AppId'];
      }
      if (params["WfTaskListId"] != null) {
        this.wfTaskListId = params["WfTaskListId"];
      }
      if (params["BizTemplateCode"] != null) {
        this.BizTemplateCode = params["BizTemplateCode"];
      }
      if (params["ReturnHandlingHId"] != null) {
        this.ReturnHandlingHId = params["ReturnHandlingHId"];
      }
    });
  }

  ngOnInit() {
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewCustCompletionData.json";
    this.viewGenericObj.viewEnvironment = environment.losUrl;
    this.viewGenericObj.ddlEnvironments = [
      {
        name: "AppNo",
        environment: environment.losR3Web
      }
    ];

    this.inputGridObj = new InputGridObj();
    if (this.ReturnHandlingHId != 0) {
      this.inputGridObj.pagingJson = "./assets/ucgridview/gridCustCompletionDataRtn.json";
      this.MakeViewReturnInfoObj();
      this.addObj["ReturnHandlingHId"] = this.ReturnHandlingHId;
    }
    else {
      this.inputGridObj.pagingJson = "./assets/ucgridview/gridCustCompletionData.json";
    }
    this.addObj["WfTaskListId"] = this.wfTaskListId;
    this.addObj["BizTemplateCode"] = this.BizTemplateCode;

    this.loadCustCompletionListData();
    this.claimTask();
  }

  MakeViewReturnInfoObj() {
    if (this.ReturnHandlingHId > 0) {
      var obj = {
        ReturnHandlingHId: this.ReturnHandlingHId,
        MrReturnTaskCode: CommonConstant.ReturnHandlingEditNAP4
      }
      this.http.post<ReturnHandlingDObj>(URLConstant.GetLastReturnHandlingDByReturnHandlingHIdAndMrReturnTaskCode, obj).subscribe(
        (response) => {
          this.ResponseReturnInfoObj = response;
          this.FormReturnObj.patchValue({
            ReturnExecNotes: this.ResponseReturnInfoObj.ReturnHandlingExecNotes
          });
          this.OnFormReturnInfo = true;
        });
    }
  }

  loadCustCompletionListData() {
    this.http.post(URLConstant.GetListAppCustCompletion, { AppId: this.AppId }).subscribe(
      (response) => {
        this.inputGridObj.resultData = {
          Data: ""
        }
        this.inputGridObj.resultData["Data"] = new Array();
        this.inputGridObj.resultData.Data = response;
        this.listCustCompletion = this.inputGridObj.resultData.Data;
      }
    );
  }

  async claimTask() {
    var currentUserContext = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));
    var wfClaimObj = { pWFTaskListID: this.wfTaskListId, pUserID: currentUserContext[CommonConstant.USER_NAME], isLoading: false };
    this.http.post(URLConstant.ClaimTask, wfClaimObj).subscribe(() => { });
  }

  buttonBackOnClick() {
    this.router.navigate(['/Nap/CustCompletion/Paging'], { queryParams: { BizTemplateCode: this.BizTemplateCode } });
  }

  buttonSubmitOnClick() {
    this.http.post(URLConstant.SubmitAppCustCompletion, { "AppId": this.AppId, "WfTaskListId": this.wfTaskListId }).subscribe(
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
      ReturnHandlingResult.ReturnHandlingDId = this.ResponseReturnInfoObj.ReturnHandlingDId;
      ReturnHandlingResult.MrReturnTaskCode = this.ResponseReturnInfoObj.MrReturnTaskCode;
      ReturnHandlingResult.ReturnStat = this.ResponseReturnInfoObj.ReturnStat;
      ReturnHandlingResult.ReturnHandlingNotes = this.ResponseReturnInfoObj.ReturnHandlingNotes;
      ReturnHandlingResult.ReturnHandlingExecNotes = this.FormReturnObj.controls['ReturnExecNotes'].value;
      ReturnHandlingResult.RowVersion = this.ResponseReturnInfoObj.RowVersion;

      this.http.post(URLConstant.EditReturnHandlingD, ReturnHandlingResult).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          AdInsHelper.RedirectUrl(this.router, ["/Nap/AddProcess/ReturnHandling/EditAppPaging"], { BizTemplateCode: CommonConstant.CF4W });
        }
      )
    }
  }
}
