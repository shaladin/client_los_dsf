import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { Validators, FormBuilder } from '@angular/forms';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { Location, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { Router, ActivatedRoute } from '@angular/router';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { CookieService } from "ngx-cookie";
import { UcViewGenericObj } from 'app/shared/model/uc-view-generic-obj.model';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';

@Component({
  selector: 'app-change-mou-execution-detail-x',
  templateUrl: './change-mou-execution-detail-x.component.html',
  styleUrls: []
})
export class ChangeMouExecutionDetailXComponent implements OnInit {
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  businessDt: Date;
  MouCustId: number = 0;
  WfTaskListId: number;
  TrxNo : number;
  TrxType: string;
  MouType: string = "";
  ChangeMouTrxId: number = 0;
  changeMouTrxIdPrev: number;

  ChangeMouExecutionForm = this.fb.group({
    MouCustId: [''],
    WfTaskListId: [''],
    MouCustDt: ['', [Validators.required]],
    StartDt: ['', [Validators.required]],
    EndDt: ['', [Validators.required]],
    TrxNo : ['']
  });

  constructor(private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private location: Location,
    private httpClient: HttpClient,
    private toastr: NGXToastrService,
    private router: Router,
    private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
      if (params['MouCustId'] != null) {
        this.MouCustId = params['MouCustId'];
        this.ChangeMouExecutionForm.controls.MouCustId.setValue(this.MouCustId);
      }
      if (params['WfTaskListId'] != null) {
        this.WfTaskListId = params['WfTaskListId'];
        this.ChangeMouExecutionForm.controls.WfTaskListId.setValue(this.WfTaskListId);
      }
      if (params['TrxNo'] != null) {
        this.TrxNo = params['TrxNo'];
      }
      if (params['TrxType'] != null) {
        this.TrxType = params["TrxType"];
      }
      if (params['ChangeMouTrxId'] != null) {
        this.ChangeMouTrxId = params["ChangeMouTrxId"];
      }
    });
  }

  ngOnInit() {

    let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    let wfClaimObj = { pWFTaskListID: this.WfTaskListId, pUserID: currentUserContext[CommonConstant.USER_NAME] };
    this.httpClient.post(URLConstant.ClaimTask, wfClaimObj).subscribe(
      (response) => {
      });

      let datePipe = new DatePipe("en-US");
      if (currentUserContext != null && currentUserContext != undefined) {
        this.businessDt = new Date(currentUserContext[CommonConstant.BUSINESS_DT]);
        this.businessDt.setDate(this.businessDt.getDate() - 1);
      }

      this.httpClient.post(URLConstant.GetMouCustById, { Id: this.MouCustId }).subscribe(
        (response) => {
          this.MouType = response["MrMouTypeCode"];
          if(response['MrMouTypeCode'] == CommonConstant.FACTORING){
            this.viewGenericObj.viewInput = "./assets/impl/ucviewgeneric/viewMouRequestX.json";
          }else{
            this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewMouRequest.json";
          }

          if (response["MouCustDt"] != null) {
            response["MouCustDt"] = datePipe.transform(response["MouCustDt"], "yyyy-MM-dd");
          }
          response["StartDt"] = datePipe.transform(response["StartDt"], "yyyy-MM-dd");
          response["EndDt"] = datePipe.transform(response["EndDt"], "yyyy-MM-dd");
          this.ChangeMouExecutionForm.patchValue({
            StartDt: response["StartDt"],
            EndDt: response["EndDt"],
            MouCustDt: response["MouCustDt"],
            TrxNo : this.TrxNo
          });
        });


        this.viewGenericObj.ddlEnvironments = [
          {
            name: "MouCustNo",
            environment: environment.losR3Web
          },
        ];
  }

  Back() {
    this.router.navigate([NavigationConstant.CHANGE_MOU_EXEC_PAGING]);
  }
  GetCallBack(ev: any) {
   if (ev.Key == "customer") {

        AdInsHelper.OpenMOUCustViewByMouCustId(ev.ViewObj.MouCustId);
    }
}

  SaveForm() {
    let request = this.ChangeMouExecutionForm.value;
    this.httpClient.post(URLConstant.ChangeMouExecutionHumanActivity, request).subscribe(
      (response) => {
        this.toastr.successMessage(response["Message"]);
        AdInsHelper.RedirectUrl(this.router,[NavigationConstant.CHANGE_MOU_EXEC_PAGING],{});
      });

  }

}
