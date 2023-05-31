import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { ClaimTaskService } from 'app/shared/claimTask.service';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { DuplicateCustObj } from 'app/shared/model/duplicate-cust-obj.model';
import { ResDuplicateCustomerObj } from 'app/shared/model/lead/res-duplicate-customer-obj.model';
import { ResDuplicateDoubleFinancingObj } from 'app/shared/model/lead/res-duplicate-double-financing-obj.model';
import { ResDuplicateNegativeAssetObj } from 'app/shared/model/lead/res-duplicate-negative-asset-obj.model';
import { ResDuplicateNegativeCustomerObj } from 'app/shared/model/lead/res-duplicate-negative-customer-obj.model';
import { LeadAssetObj } from 'app/shared/model/lead-asset-obj.model';
import { LeadCustObj } from 'app/shared/model/lead-cust-obj.model';
import { LeadCustPersonalObj } from 'app/shared/model/lead-cust-personal-obj.model';
import { LeadForLeadVerfObj } from 'app/shared/model/lead-for-lead-verf.model';
import { LeadFraudVerfObj } from 'app/shared/model/lead-fraud-verf-obj.model';
import { NegativeAssetCheckObj } from 'app/shared/model/negative-asset-check-obj.model';
import { UcViewGenericObj } from 'app/shared/model/uc-view-generic-obj.model';
import { ClaimWorkflowObj } from 'app/shared/model/workflow/claim-workflow-obj.model';
import { environment } from 'environments/environment';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-new-fraud-verif-detail',
  templateUrl: './new-fraud-verif-detail.component.html',
  styles: []
})
export class NewFraudVerifDetailComponent implements OnInit {
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  DuplicateCustObj: DuplicateCustObj = new DuplicateCustObj();
  leadCustObj: LeadCustObj = new LeadCustObj();
  leadAssetObj: LeadAssetObj = new LeadAssetObj();;
  LeadId: number;
  WfTaskListId: any;
  leadCustPersonalObj: LeadCustPersonalObj = new LeadCustPersonalObj();;
  DuplicateStatus: string;
  ResultDuplicate: Array<ResDuplicateCustomerObj> = new Array<ResDuplicateCustomerObj>();
  ResultDuplicateNegative: ResDuplicateNegativeCustomerObj = new ResDuplicateNegativeCustomerObj();
  negativeAssetCheckObj: NegativeAssetCheckObj = new NegativeAssetCheckObj();
  ResultDuplicateAssetNegative: ResDuplicateNegativeAssetObj = new ResDuplicateNegativeAssetObj();
  ResultDuplicateDoubleFinancing: ResDuplicateDoubleFinancingObj = new ResDuplicateDoubleFinancingObj();
  leadFraudVerfObj: LeadFraudVerfObj = new LeadFraudVerfObj();
  ChoosenCustIdx: number;
  IsCustPicked: boolean = false;
  HasDuplicateCust: boolean = false;
  DuplicateLeadList: Array<LeadForLeadVerfObj> = new Array<LeadForLeadVerfObj>();
  urlPost : string;

  FraudVerfForm = this.fb.group({
    Notes: ['', [Validators.required]],
  });

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private toastr: NGXToastrService,
    private fb: FormBuilder,
    private router: Router,
    private cookieService: CookieService,
    private claimTaskService: ClaimTaskService
  ) {
    this.route.queryParams.subscribe(params => {
      this.LeadId = params['LeadId'];
    });
    this.route.queryParams.subscribe(params => {
      this.WfTaskListId = params['WfTaskListId'];
    });
  }

  ngOnInit() {
    if(environment.isCore){
      this.urlPost = URLConstant.AddNewLeadFraudVerfV2;

      if(this.WfTaskListId != "" && this.WfTaskListId != undefined){
        this.claimTaskService.ClaimTaskV2(this.WfTaskListId);
      }
    }
    else{
      this.urlPost = URLConstant.AddNewLeadFraudVerf;

      if (this.WfTaskListId > 0)
        this.claimTaskService.ClaimTask(this.WfTaskListId);
    }

    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewLeadHeader.json";
    this.viewGenericObj.ddlEnvironments = [
      {
        name: "LeadNo",
        environment: environment.losR3Web
      },
    ];
    this.leadCustObj.LeadId = this.LeadId;
    let obj = {
      Id: this.leadCustObj.LeadId
    }
    this.http.post(URLConstant.GetLeadCustByLeadId, obj).subscribe(
      (response: LeadCustObj) => {
        let tempLeadCustObj = response;
        this.leadCustPersonalObj.LeadCustId = tempLeadCustObj.LeadCustId;
        obj = {
          Id: this.leadCustPersonalObj.LeadCustId
        }
        this.http.post(URLConstant.GetLeadCustPersonalByLeadCustId, obj).subscribe(
          (response: LeadCustPersonalObj) => {
            let tempLeadCustPersonalObj = response;
            this.DuplicateCustObj.CustName = tempLeadCustObj.CustName;
            this.DuplicateCustObj.MrCustTypeCode = CommonConstant.CustTypePersonal;
            this.DuplicateCustObj.IdNo = tempLeadCustObj.IdNo;
            this.DuplicateCustObj.TaxIdNo = tempLeadCustObj.TaxIdNo;
            this.DuplicateCustObj.BirthDt = tempLeadCustPersonalObj.BirthDt;
            this.DuplicateCustObj.MotherMaidenName = tempLeadCustPersonalObj.MotherMaidenName;
            this.DuplicateCustObj.MobilePhnNo1 = tempLeadCustPersonalObj.MobilePhnNo1; 

            this.http.post(URLConstant.GetCustomerAndNegativeCustDuplicateCheck, this.DuplicateCustObj).subscribe(
              (response) => {
                this.DuplicateStatus = response["Status"];
                if (this.DuplicateStatus != null && this.DuplicateStatus != undefined) {
                  this.ResultDuplicate = response[CommonConstant.ReturnObj]["CustDuplicate"];
                  this.ResultDuplicateNegative = response[CommonConstant.ReturnObj]["NegativeCustDuplicate"];
                }
                this.HasDuplicateCust = this.ResultDuplicate && this.ResultDuplicate.length > 0 ? true : false;
              });
          });
      });
    this.http.post(URLConstant.GetListLeadForLeadVerfObj, { Id: this.LeadId }).toPromise().then(
      (response) => {
        this.DuplicateLeadList = response["LeadList"];
      }
    ).catch(
      (error) => {
        console.log(error);
      }
    );
  }

  openViewHandler(LeadId) {
    window.open("/View/Lead?LeadId=" + LeadId, "_blank");
  }

  custHandler() {
    this.IsCustPicked = true;
  }

  reject(): void {
    this.leadFraudVerfObj = new LeadFraudVerfObj();
    this.leadFraudVerfObj.LeadId = this.LeadId;
    this.leadFraudVerfObj.VerifyStat = CommonConstant.Reject;
    this.leadFraudVerfObj.Notes = this.FraudVerfForm.controls["Notes"].value;
    this.leadFraudVerfObj.WfTaskListId = this.WfTaskListId;
    this.leadFraudVerfObj.IsCustPicked = false;
    this.leadFraudVerfObj.HasDuplicateCust = false;
    this.http.post(this.urlPost, this.leadFraudVerfObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        AdInsHelper.RedirectUrl(this.router, [NavigationConstant.SIMPLE_LEAD_FRAUD_VERIF_PAGING], {});
      });
  }

  SkipVerify(): void {
    this.leadFraudVerfObj = new LeadFraudVerfObj();
    this.leadFraudVerfObj.LeadId = this.LeadId;
    this.leadFraudVerfObj.VerifyStat = CommonConstant.Verify;
    this.leadFraudVerfObj.Notes = this.FraudVerfForm.controls["Notes"].value;
    this.leadFraudVerfObj.WfTaskListId = this.WfTaskListId;
    this.leadFraudVerfObj.IsCustPicked = false;
    this.leadFraudVerfObj.HasDuplicateCust = false;
    this.http.post(this.urlPost, this.leadFraudVerfObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        AdInsHelper.RedirectUrl(this.router, [NavigationConstant.SIMPLE_LEAD_FRAUD_VERIF_PAGING], {});
      });
  }

  verify(): void {
    if (this.HasDuplicateCust) {
      if (!this.IsCustPicked) {
        this.toastr.warningMessage("Please Choose Customer to Verify");
        return;
      }
    }

    this.leadFraudVerfObj = new LeadFraudVerfObj();
    this.leadFraudVerfObj.LeadId = this.LeadId;
    this.leadFraudVerfObj.VerifyStat = CommonConstant.Verify;
    this.leadFraudVerfObj.Notes = this.FraudVerfForm.controls["Notes"].value;
    this.leadFraudVerfObj.WfTaskListId = this.WfTaskListId;
    this.leadFraudVerfObj.LeadCustData = this.ResultDuplicate[this.ChoosenCustIdx];
    this.leadFraudVerfObj.IsCustPicked = this.IsCustPicked;
    this.leadFraudVerfObj.HasDuplicateCust = this.HasDuplicateCust;

    this.http.post(this.urlPost, this.leadFraudVerfObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        AdInsHelper.RedirectUrl(this.router, [NavigationConstant.SIMPLE_LEAD_FRAUD_VERIF_PAGING], {});
      });
  }

  backHandler() {
    AdInsHelper.RedirectUrl(this.router, [NavigationConstant.SIMPLE_LEAD_FRAUD_VERIF_PAGING], {});
  }

}
