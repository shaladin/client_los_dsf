import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
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

@Component({
  selector: 'app-mou-execution-detail',
  templateUrl: './mou-execution-detail.component.html',
  styleUrls: ['./mou-execution-detail.component.scss']
})
export class MouExecutionDetailComponent implements OnInit {
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  businessDt: Date;
  MouCustId: number;
  WfTaskListId: number;
  MinEndDt: Date;
  MouExecutionForm = this.fb.group({
    MouCustId: [''],
    WfTaskListId: [''],
    MouCustDt: ['', [Validators.required]],
    StartDt: ['', [Validators.required]],
    EndDt: ['', [Validators.required]]
  });
  datePipe = new DatePipe("en-US");
  resultData: MouCustObj;

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private toastr: NGXToastrService,
    private router: Router, private cookieService: CookieService) {
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

  ngOnInit() {
    var currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    var wfClaimObj = { pWFTaskListID: this.WfTaskListId, pUserID: currentUserContext[CommonConstant.USER_NAME] };
    this.httpClient.post(URLConstant.ClaimTask, wfClaimObj).subscribe(
      (response) => {
      });

    var datePipe = new DatePipe("en-US");
    var currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    if (currentUserContext != null && currentUserContext != undefined) {
      this.businessDt = new Date(currentUserContext[CommonConstant.BUSINESS_DT]);
      this.businessDt.setDate(this.businessDt.getDate());
    }

    this.httpClient.post(URLConstant.GetMouCustById, { Id: this.MouCustId }).subscribe(
      (response: any) => {
        this.resultData = response; 
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
      });

    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewMouRequest.json";
    this.viewGenericObj.viewEnvironment = environment.losUrl;
    this.viewGenericObj.ddlEnvironments = [
      {
        name: "MouCustNo",
        environment: environment.losR3Web
      },
    ];
  }

  Back() {
    AdInsHelper.RedirectUrl(this.router, [NavigationConstant.MOU_EXECUTION_PAGING], {});
  }

  SaveForm() {
    if((this.datePipe.transform(this.MouExecutionForm.controls.MouCustDt.value, "yyyy-MM-dd") < this.datePipe.transform(this.businessDt, "yyyy-MM-dd") )){
      this.toastr.warningMessage(ExceptionConstant.MOU_DATE_CANNOT_LESS_THAN +  this.datePipe.transform(this.businessDt, 'MMMM d, y'));
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
    var request = this.MouExecutionForm.value;
    this.httpClient.post(URLConstant.MouCustExecutionHumanActivity, request).subscribe(
      (response) => {
        this.toastr.successMessage(response["Message"]);
        AdInsHelper.RedirectUrl(this.router, [NavigationConstant.MOU_EXECUTION_PAGING], {});
      });
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
    if(ev.target.value < this.datePipe.transform(this.businessDt, "yyyy-MM-dd") ){
      this.toastr.warningMessage(ExceptionConstant.MOU_DATE_CANNOT_LESS_THAN +  this.datePipe.transform(this.businessDt, 'MMMM d, y'));
   } 
  }

  GetCallBack(event) {
    if (event.Key == "customer") {
      var custObj = { CustNo: this.resultData["CustNo"] };
      this.httpClient.post(URLConstant.GetCustByCustNo, custObj)
        .subscribe((response) => {
          AdInsHelper.OpenCustomerViewByCustId(response["CustId"]);
        });
    }
  }
}
