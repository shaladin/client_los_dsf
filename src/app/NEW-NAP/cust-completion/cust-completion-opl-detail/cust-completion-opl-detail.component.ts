import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { InputGridObj } from 'app/shared/model/InputGridObj.Model';
import { ReturnHandlingDObj } from 'app/shared/model/ReturnHandling/ReturnHandlingDObj.Model';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { environment } from 'environments/environment';
import { FormBuilder } from '@angular/forms';
import { SubmitNapObj } from 'app/shared/model/Generic/SubmitNapObj.Model';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';
import { ResReturnHandlingDObj } from 'app/shared/model/Response/ReturnHandling/ResReturnHandlingDObj.model';

@Component({
  selector: 'app-cust-completion-opl-detail',
  templateUrl: './cust-completion-opl-detail.component.html',
  styleUrls: []
})
export class CustCompletionOplDetailComponent implements OnInit {
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  inputGridObj: InputGridObj = new InputGridObj();
  AppId: number;
  wfTaskListId: number;
  BizTemplateCode: string = "OPL";
  addObj: object = {};
  FormReturnObj = this.fb.group({
    ReturnExecNotes: ['']
  });
  ReturnHandlingHId: number = 0;
  ResponseReturnInfoObj: ResReturnHandlingDObj = new ResReturnHandlingDObj();
  OnFormReturnInfo: boolean = false;

  constructor(private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private toastr: NGXToastrService, 
    private fb: FormBuilder,
    private cookieService: CookieService) {
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

  ngOnInit() {
    this.BizTemplateCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE)
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/opl/view-opl-main-info.json";
    this.viewGenericObj.viewEnvironment = environment.losUrl;

    this.inputGridObj = new InputGridObj();
    if (this.ReturnHandlingHId != 0) {
      this.inputGridObj.pagingJson = "./assets/ucgridview/new-nap/cust-completion/grid-cust-completion-data-rtn-opl.json";
      this.MakeViewReturnInfoObj();
      this.addObj["ReturnHandlingHId"] = this.ReturnHandlingHId;
    }
    else {
      this.inputGridObj.pagingJson = "./assets/ucgridview/new-nap/cust-completion/grid-cust-completion-data-opl.json";
    }
    this.addObj["WfTaskListId"] = this.wfTaskListId;
    this.addObj["BizTemplateCode"] = this.BizTemplateCode;

    this.loadCustCompletionListData();
    this.claimTask();
  }

  MakeViewReturnInfoObj() {
    if (this.ReturnHandlingHId > 0) {
      let ReqByIdAndCodeObj = new GenericObj();
      ReqByIdAndCodeObj.Id = this.ReturnHandlingHId;
      ReqByIdAndCodeObj.Code = CommonConstant.ReturnHandlingEditCust;
      this.http.post(URLConstant.GetLastReturnHandlingDByReturnHandlingHIdAndMrReturnTaskCode, ReqByIdAndCodeObj).subscribe(
        (response : ResReturnHandlingDObj) => {
          this.ResponseReturnInfoObj = response;
          console.log("Isi dari ResponseReturnInfoObj: ", this.ResponseReturnInfoObj);
          this.FormReturnObj.patchValue({
            ReturnExecNotes: this.ResponseReturnInfoObj.ReturnHandlingExecNotes
          });
          this.OnFormReturnInfo = true;
        }
      );
    }
  }

  loadCustCompletionListData() {
    this.http.post(URLConstant.GetListAppCustCompletion, { Id: this.AppId }).subscribe(
      (response) => {
        this.inputGridObj.resultData = {
          Data: ""
        }
        this.inputGridObj.resultData["Data"] = new Array();
        this.inputGridObj.resultData.Data = response;
      }
    );
  }

  async claimTask() {
    let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    var wfClaimObj = { pWFTaskListID: this.wfTaskListId, pUserID: currentUserContext[CommonConstant.USER_NAME], isLoading: false };
    this.http.post(URLConstant.ClaimTask, wfClaimObj).subscribe(() => { });
  }

  buttonBackOnClick() {
    AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_EDIT_CUST_PAGING], { BizTemplateCode: this.BizTemplateCode });
  }

  buttonSubmitOnClick() {
    let reqObj: SubmitNapObj = new SubmitNapObj();
    reqObj.AppId = this.AppId;
    reqObj.WfTaskListId = this.wfTaskListId;
    this.http.post(URLConstant.SubmitAppCustCompletion, reqObj).subscribe(
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

      this.http.post(URLConstant.EditReturnHandlingD, ReturnHandlingResult).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          this.buttonBackOnClick();
        }
      )
    }
  }

  GetCallBack(event: any) {
    if(event.Key === "Application") {
      AdInsHelper.OpenAppViewByAppId(event.ViewObj.AppId);
    }
    else if (event.Key === "ProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(event.ViewObj.ProdOfferingCode, event.ViewObj.ProdOfferingVersion);
    }
  }
}