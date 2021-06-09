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
  startMouDt: Date; 
  StartDt: Date;
  EndDt: Date;
  MouCustDt: Date;

  MouExecutionForm = this.fb.group({
    MouCustId: [''],
    WfTaskListId: [''],
    MouCustDt: ['', [Validators.required]],
    StartDt: ['', [Validators.required]],
    EndDt: ['', [Validators.required]]
  });

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
    if (currentUserContext != null && currentUserContext != undefined) {
      this.businessDt = new Date(currentUserContext[CommonConstant.BUSINESS_DT]);
      this.startMouDt = new Date(currentUserContext[CommonConstant.BUSINESS_DT]);
      this.startMouDt = new Date(this.startMouDt.setDate(this.businessDt.getDate() - 1));
    }

    this.httpClient.post(URLConstant.GetMouCustById, { Id: this.MouCustId }).subscribe(
      (response: any) => {
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
  }

  Back() {
    AdInsHelper.RedirectUrl(this.router, [NavigationConstant.MOU_EXECUTION_PAGING], {});
  }

  SaveForm() {
    var request = this.MouExecutionForm.value;

    if (this.ValidateDate()) {
      this.httpClient.post(URLConstant.MouCustExecutionHumanActivity, request).subscribe(
        (response: any) => {
          this.toastr.successMessage(response["Message"]);
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.MOU_EXECUTION_PAGING], {});
        });
    }
  }

  ValidateDate() {
    this.MouCustDt = new Date(this.MouExecutionForm.get("MouCustDt").value);
    this.StartDt = new Date(this.MouExecutionForm.get("StartDt").value);
    this.EndDt = new Date(this.MouExecutionForm.get("EndDt").value);

    if(this.MouCustDt < this.startMouDt){
      this.toastr.warningMessage(ExceptionConstant.MOU_DT_MUST_GREATER_THAN_BUSINESS_DT);
      return false;
    }

    if (this.StartDt > this.EndDt) {
      this.toastr.warningMessage(ExceptionConstant.START_DT_MUST_LESS_THAN_END_DT);
      return false;
    }

    if (this.EndDt <= this.businessDt) {
      this.toastr.warningMessage(ExceptionConstant.END_DT_MUST_GREATER_THAN_BUSINESS_DT);
      return false;
    }
    
    if (this.StartDt <= this.businessDt) {
      this.toastr.warningMessage(ExceptionConstant.START_DT_MUST_GREATER_THAN_BUSINESS_DT);
      return false;
    }
    return true;
  }
}
