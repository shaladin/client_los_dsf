import { Component, OnInit, ViewChild } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { FormBuilder, Validators } from '@angular/forms';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { UcInputApprovalObj } from 'app/shared/model/UcInputApprovalObj.Model';
import { UcInputApprovalHistoryObj } from 'app/shared/model/UcInputApprovalHistoryObj.Model';
import { UcInputApprovalGeneralInfoObj } from 'app/shared/model/UcInputApprovalGeneralInfoObj.model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstantDsf } from 'app/shared/constant/NavigationConstantDsf';
import { URLConstantDsf } from 'app/shared/constant/URLConstantDsf';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-customer-group-plafond-apv-detail-dsf',
  templateUrl: './customer-group-plafond-apv-detail-dsf.component.html',
  styleUrls: ['./customer-group-plafond-apv-detail-dsf.component.css'],
  providers: [NGXToastrService]
})
export class CustomerGroupPlafondApvDetailDsfComponent implements OnInit {
  viewCustomerGroupPlafondDetailObj: UcViewGenericObj = new UcViewGenericObj();
  CustGrpNo: any;
  ApvReqId: number;
  taskId: number;
  inputObj: any;
  InputApvObj: UcInputApprovalObj;
  InputApprovalHistoryObj: UcInputApprovalHistoryObj;
  UcInputApprovalGeneralInfoObj: UcInputApprovalGeneralInfoObj;
  IsReady: boolean = false;
  CustGrpPlfnReqDsfObj: any;
  CustGrpPlafondId: any;
  CustGrpPlfndObj: any;
  resultData: any;

  plafondProposalForm = this.fb.group({
    PlafondMax: [''],
    StartPlafondDate: [''],
    EndPlafondDate: ['']
  });
  constructor(private router: Router, private route: ActivatedRoute, private toastr: NGXToastrService, private http: HttpClient,private fb: FormBuilder) { 
    this.route.queryParams.subscribe(params => {

      if (params["CustGrpNo"] != null) {
        this.CustGrpNo = params["CustGrpNo"];
      }
      if (params['CustGrpPlafondId'] != null) {
        this.CustGrpPlafondId = params['CustGrpPlafondId'];
      }
      this.ApvReqId = params["ApvReqId"];
      this.taskId = params["TaskId"];

    });
  }

  ngOnInit() {
    
    this.viewCustomerGroupPlafondDetailObj.viewInput = "./assets/ucviewgeneric/viewCustomerGroupPlafondDetail.json";
    this.initInputApprovalObj();
    this.GetListCustomerGroupPlafondDetailDsfByCustomerGroupPlafondId();
    this.GetCustomerGroupPlafondDsfByCustomerGroupPlafondId();
    
  }
  GetListCustomerGroupPlafondDetailDsfByCustomerGroupPlafondId() {
    var obj = { CustomerGroupPlafondDsfId: this.CustGrpPlafondId }
    this.http.post(URLConstantDsf.GetListCustomerGroupPlafondDetailDsfByCustomerGroupPlafondId, obj).subscribe(
      (response) => {
        this.CustGrpPlfndObj = response;
      }
    );
  }
  GetCustomerGroupPlafondDsfByCustomerGroupPlafondId() {
    var datePipe = new DatePipe("en-US");
    var obj = { CustGrpPlfndDsfId: this.CustGrpPlafondId }
    this.http.post(URLConstantDsf.GetCustomerGroupPlafondDsfByCustomerGroupPlafondId, obj).subscribe(
      (response) => {
        this.resultData = response;
        this.plafondProposalForm.patchValue({
          PlafondMax: this.resultData.PropPlafondMax,
          StartPlafondDate: datePipe.transform(this.resultData.PropDtmStart, "yyyy-MM-dd"),
          EndPlafondDate: datePipe.transform(this.resultData.PropDtmEnd, "yyyy-MM-dd")
        })
      });
  }

  onApprovalSubmited(event) {
    let ReqCustomerGroupPlafondApvCustomObj = {
      Tasks: event.Tasks
    }

    this.http.post(URLConstantDsf.CustomerGroupPlafondApproval, ReqCustomerGroupPlafondApvCustomObj ).subscribe(
      () => {
        AdInsHelper.RedirectUrl(this.router,[NavigationConstantDsf.CUSTOMER_GROUP_PLAFOND_APPROVAL_PAGING],{});
      }
    );
  }

  onCancelClick() {
    AdInsHelper.RedirectUrl(this.router,[NavigationConstantDsf.CUSTOMER_GROUP_PLAFOND_APPROVAL_PAGING],{});
  }
  
  initInputApprovalObj() {
    this.UcInputApprovalGeneralInfoObj = new UcInputApprovalGeneralInfoObj();
    this.UcInputApprovalGeneralInfoObj.EnvUrl = environment.FoundationR3Url;
    this.UcInputApprovalGeneralInfoObj.PathUrl = "/Approval/GetSingleTaskInfo";
    this.UcInputApprovalGeneralInfoObj.TaskId = this.taskId;

    this.InputApprovalHistoryObj = new UcInputApprovalHistoryObj();
    this.InputApprovalHistoryObj.EnvUrl = environment.FoundationR3Url;
    this.InputApprovalHistoryObj.PathUrl = "/Approval/GetTaskHistory";
    this.InputApprovalHistoryObj.RequestId = this.ApvReqId;

    this.InputApvObj = new UcInputApprovalObj();
    this.InputApvObj.TaskId = this.taskId;
    this.InputApvObj.TrxNo = this.CustGrpNo;
    this.InputApvObj.RequestId = this.ApvReqId;
    this.IsReady = true;
  }

}
