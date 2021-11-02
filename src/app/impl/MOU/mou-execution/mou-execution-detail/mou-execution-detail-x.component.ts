import { Component, OnInit } from '@angular/core';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { Validators, FormBuilder } from '@angular/forms';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { Router, ActivatedRoute } from '@angular/router';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { CookieService } from 'ngx-cookie';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { MouCustObj } from 'app/shared/model/MouCustObj.Model';
import { environment } from 'environments/environment';
import { ClaimTaskService } from 'app/shared/claimTask.service';
import { ResSysConfigResultObj } from 'app/shared/model/Response/ResSysConfigResultObj.model';
import { DMSObj } from 'app/shared/model/DMS/DMSObj.model';
import { DMSLabelValueObj } from 'app/shared/model/DMS/DMSLabelValueObj.Model';
import { AdInsHelperService } from 'app/shared/services/AdInsHelper.service';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';

@Component({
  selector: 'app-mou-execution-detail-x',
  templateUrl: './mou-execution-detail-x.component.html',
})
export class MouExecutionDetailXComponent implements OnInit {
  businessDt: Date;
  MouCustId: number = 0;
  WfTaskListId: any;
  MouType: string = "";
  MrCustTypeCode: string = "";
  businessDtYesterday: Date; 
  StartDt: Date;
  EndDt: Date;
  MouCustDt: Date;
  dmsObj: DMSObj = new DMSObj();
  SysConfigResultObj: ResSysConfigResultObj = new ResSysConfigResultObj();

  MouExecutionForm = this.fb.group({
    MouCustId: [''],
    WfTaskListId: [''],
    MouCustDt: ['', [Validators.required]],
    StartDt: ['', [Validators.required]],
    EndDt: ['', [Validators.required]]
  });
  datePipe = new DatePipe("en-US");
  resultData: MouCustObj = new MouCustObj();

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private toastr: NGXToastrService,
    private router: Router, 
    private cookieService: CookieService,
    private claimTaskService: ClaimTaskService,
    private AdInsHelperService: AdInsHelperService) {
    this.route.queryParams.subscribe(params => {
      if (params['MouCustId'] != null) {
        this.MouCustId = params['MouCustId'];
        this.MouExecutionForm.controls.MouCustId.setValue(this.MouCustId);
      }
      if (params['WfTaskListId'] != null) {
        this.WfTaskListId = params['WfTaskListId'];
        this.MouExecutionForm.controls.WfTaskListId.setValue(this.WfTaskListId);
      }
    });
  }

  readonly MouTypeGeneral: string = CommonConstant.GENERAL;
  isReady: boolean = false;
  async ngOnInit() {
    await this.httpClient.post<ResSysConfigResultObj>(URLConstant.GetSysConfigPncplResultByCode, { Code: CommonConstant.ConfigCodeIsUseDms }).toPromise().then(
      (response) => {
        this.SysConfigResultObj = response
      });

    const currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.claimTask();

    let datePipe = new DatePipe("en-US");

    if (currentUserContext != null && currentUserContext != undefined) {
      this.businessDt = new Date(currentUserContext[CommonConstant.BUSINESS_DT]);
      this.businessDtYesterday = new Date(currentUserContext[CommonConstant.BUSINESS_DT]);
      this.businessDtYesterday = new Date(this.businessDtYesterday.setDate(this.businessDt.getDate() - 1));
    }

    await this.httpClient.post(URLConstant.GetMouCustById, { Id: this.MouCustId }).toPromise().then(
      (response: any) => {
        this.MouType = response["MrMouTypeCode"];
        this.MrCustTypeCode = response.MrCustTypeCode;
        this.resultData = response;

        const datePipe = new DatePipe("en-US");
        if (response["MouCustDt"] != null) {
          response["MouCustDt"] = datePipe.transform(response["MouCustDt"], "yyyy-MM-dd");
        }
        response["StartDt"] = datePipe.transform(response["StartDt"], "yyyy-MM-dd");
        response["EndDt"] = datePipe.transform(response["EndDt"], "yyyy-MM-dd");

        this.MouExecutionForm.patchValue({
          StartDt: response["StartDt"],
          EndDt: response["EndDt"],
          MouCustDt: response["MouCustDt"]
        });
        
        if(this.SysConfigResultObj.ConfigValue == '1'){
          this.dmsObj = new DMSObj();
          this.dmsObj.User = currentUserContext.UserName;
          this.dmsObj.Role = currentUserContext.RoleCode;
          this.dmsObj.ViewCode = CommonConstant.DmsViewCodeMou;
          this.dmsObj.MetadataParent.push(new DMSLabelValueObj(CommonConstant.DmsNoCust, this.resultData['CustNo']));
          if (this.resultData['CustNo'] != null && this.resultData['CustNo'] != "") {
            this.dmsObj.MetadataParent.push(new DMSLabelValueObj(CommonConstant.DmsNoCust, this.resultData['CustNo']));
          }
          else {
            this.dmsObj.MetadataParent.push(new DMSLabelValueObj(CommonConstant.DmsNoCust, this.resultData['ApplicantNo']));
          }
          this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsMouId, this.resultData.MouCustNo));
          this.dmsObj.Option.push(new DMSLabelValueObj(CommonConstant.DmsOverideSecurity, CommonConstant.DmsOverideView));
        }
      });
  }

  Back() {
    AdInsHelper.RedirectUrl(this.router, [NavigationConstant.MOU_EXECUTION_PAGING], {MrMouTypeCode : this.MouType});
  }

  SaveForm() {
    if ((this.datePipe.transform(this.MouExecutionForm.controls.MouCustDt.value, "yyyy-MM-dd") < this.datePipe.transform(this.businessDt, "yyyy-MM-dd"))) {
      this.toastr.warningMessage(ExceptionConstant.MOU_DATE_CANNOT_LESS_THAN + this.datePipe.transform(this.businessDt, 'MMMM d, y'));
      return
    }
    if (this.datePipe.transform(this.MouExecutionForm.controls.StartDt.value, "yyyy-MM-dd") < this.datePipe.transform(this.MouExecutionForm.controls.MouCustDt.value, "yyyy-MM-dd")) {
      this.toastr.warningMessage(ExceptionConstant.START_DATE_CANNOT_LESS_THAN + this.datePipe.transform(this.MouExecutionForm.controls.MouCustDt.value, 'MMMM d, y'));
      return;
    }
    if (this.datePipe.transform(this.MouExecutionForm.controls.EndDt.value, "yyyy-MM-dd") < this.datePipe.transform(this.MouExecutionForm.controls.StartDt.value, "yyyy-MM-dd")) {
      this.toastr.warningMessage(ExceptionConstant.END_DATE_CANNOT_LESS_THAN + this.datePipe.transform(this.MouExecutionForm.controls.StartDt.value, 'MMMM d, y'));
      return;
    }
    let request = this.MouExecutionForm.value;

    if (this.ValidateDate()) {
      let mouCustExecutionHumanActivityUrl = environment.isCore ? URLConstantX.MouCustExecutionHumanActivityXV2 : URLConstantX.MouCustExecutionHumanActivityX;

      this.httpClient.post(mouCustExecutionHumanActivityUrl, request).subscribe(
        (response: any) => {
          this.toastr.successMessage(response["Message"]);
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.MOU_EXECUTION_PAGING], {MrMouTypeCode : this.MouType});
      });
    }
  }

  ValidateDate() {
    this.MouCustDt = new Date(this.MouExecutionForm.get("MouCustDt").value);
    this.StartDt = new Date(this.MouExecutionForm.get("StartDt").value);
    this.EndDt = new Date(this.MouExecutionForm.get("EndDt").value);

    if (this.MouCustDt < this.businessDtYesterday) {
      this.toastr.warningMessage(ExceptionConstant.MOU_DT_MUST_GREATER_THAN_BUSINESS_DT);
      return false;
    }

    if (this.StartDt > this.EndDt) {
      this.toastr.warningMessage(ExceptionConstant.START_DT_MUST_LESS_THAN_END_DT);
      return false;
    }

    if (this.StartDt < this.businessDt) {
      this.toastr.warningMessage(ExceptionConstant.START_DT_MUST_GREATER_THAN_EQUAL_BUSINESS_DT);
      return false;
    }
    return true;
  }

  checkStartDate(ev) {
    if (this.datePipe.transform(ev.target.value, "yyyy-MM-dd") < this.datePipe.transform(this.MouExecutionForm.controls.MouCustDt.value, "yyyy-MM-dd")) {
      this.toastr.warningMessage(ExceptionConstant.START_DATE_CANNOT_LESS_THAN + this.datePipe.transform(this.MouExecutionForm.controls.MouCustDt.value, 'MMMM d, y'));
    }
  }

  checkEndDate(ev) {
    if (ev.target.value < this.datePipe.transform(this.MouExecutionForm.controls.StartDt.value, "yyyy-MM-dd")) {
      this.toastr.warningMessage(ExceptionConstant.END_DATE_CANNOT_LESS_THAN + this.datePipe.transform(this.MouExecutionForm.controls.StartDt.value, 'MMMM d, y'));
    }
  }

  checkMouDate(ev) {
    if (ev.target.value < this.datePipe.transform(this.businessDt, "yyyy-MM-dd")) {
      this.toastr.warningMessage(ExceptionConstant.MOU_DATE_CANNOT_LESS_THAN + this.datePipe.transform(this.businessDt, 'MMMM d, y'));
    }
  }

  GetCallBack(event) {
    if (event.Key == "customer") {
      let custObj = { CustNo: this.resultData["CustNo"] };
      this.httpClient.post(URLConstant.GetCustByCustNo, custObj)
        .subscribe((response) => {
          if(response["MrCustTypeCode"] == CommonConstant.CustTypePersonal){
            this.AdInsHelperService.OpenCustomerViewByCustId(response["CustId"]);
          }
          if(response["MrCustTypeCode"] == CommonConstant.CustTypeCompany){
            this.AdInsHelperService.OpenCustomerCoyViewByCustId(response["CustId"]);
          }
        });
    }
  }

  claimTask() {
    if (environment.isCore) {
      if (this.WfTaskListId != "" && this.WfTaskListId != undefined) {
        this.claimTaskService.ClaimTaskV2(this.WfTaskListId);
      }
    }
    else if (this.WfTaskListId > 0) {
      this.claimTaskService.ClaimTask(this.WfTaskListId);
    }
  }
}
