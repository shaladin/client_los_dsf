import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { FormBuilder, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie';
import { NavigationConstantDsf } from 'app/shared/constant/NavigationConstantDsf';
import { URLConstantDsf } from 'app/shared/constant/URLConstantDsf';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstantDsf } from 'app/dsf/shared/constant/CommonConstantDsf';
import { CustGrpPlfndReqDsfObj } from 'app/dsf/model/CustGrpPlfndReqDsfObj.Model';
import { UcapprovalcreateComponent } from '@adins/ucapprovalcreate';
import { environment } from 'environments/environment';
import { ReqGetByTypeCodeObj } from 'app/shared/model/ref-reason/req-get-by-type-code-obj.model';
import { UcInputRFAObj } from 'app/shared/model/uc-input-rfa-obj.model';
import { UcViewGenericObj } from 'app/shared/model/uc-view-generic-obj.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-customer-group-plafond-detail',
  templateUrl: './customer-group-plafond-detail.component.html',
  styleUrls: ['./customer-group-plafond-detail.component.css'],
  providers: [NGXToastrService]
})
export class CustomerGroupPlafondDetailComponent implements OnInit {

  viewCustomerGroupPlafondDetailObj: UcViewGenericObj = new UcViewGenericObj();
  pageType: string = "add";
  CustGrpPlafondId: any;
  CustGrpPlafondHistDsfId: any;
  CustGrpNo: any;
  CustGrpPlfndObj: any;
  CustGrpPlfndAGRObj: any;
  CustGrpPlfndOPLObj: any;
  CustGrpPlfndFACTObj: any;
  CustGrpPlfndAPPObj: any;
  resultData: any;
  InputObj: UcInputRFAObj;
  IsReady: Boolean = false;
  listReason: any;
  CustGrpPlfnReqDsfObj: any;

  private createComponent: UcapprovalcreateComponent;
  @ViewChild('ApprovalComponent') set content(content: UcapprovalcreateComponent) {
    if (content) {
      // initially setter gets called with undefined
      this.createComponent = content;
    }
  }

  plafondProposalForm = this.fb.group({
    PlafondMax: ['',Validators.required],
    StartPlafondDate: ['',Validators.required],
    EndPlafondDate: ['',Validators.required]
  });
  readonly CancelLink: string = NavigationConstantDsf.CUSTOMER_GROUP_PLAFOND_PAGING;

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder,private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
      if (params['mode'] != null) {
        this.pageType = params['mode']; // add or edit
      }

      if (params['CustGrpPlafondId'] != null) {
        this.CustGrpPlafondId = params['CustGrpPlafondId'];
      }

      if (params['CustGrpNo'] != null) {
        this.CustGrpNo = params['CustGrpNo'];
      }

      if (params['CustGrpPlafondHistDsfId'] != null && this.pageType == 'edit') {
        this.CustGrpPlafondHistDsfId = params['CustGrpPlafondHistDsfId'];
      }
    });
  }

  async ngOnInit() {
    this.viewCustomerGroupPlafondDetailObj.viewInput = "./assets/dsf/ucviewgeneric/viewCustomerGroupPlafondDetail.json";

    let tempReq: ReqGetByTypeCodeObj = { RefReasonTypeCode: CommonConstantDsf.REF_REASON_CUST_GRP_PLAFOND_APV };
    await this.http.post(URLConstant.GetListActiveRefReason, tempReq).toPromise().then(
      (response) => {
        this.listReason = response[CommonConstant.ReturnObj];
        this.plafondProposalForm.patchValue({
          Reason: this.listReason[0].Key
        });
      }
    );

    this.GetListCustomerGroupPlafondDetailDsfByCustomerGroupPlafondId();
    this.initInputApprovalObj();

    if (this.pageType == "edit") {
      this.GetExistingPlafondRequestByCustomerGroupPlafondId();
    }
  }

  GetListCustomerGroupPlafondDetailDsfByCustomerGroupPlafondId() {
    var obj = { CustomerGroupPlafondDsfId: this.CustGrpPlafondId }
    this.http.post(URLConstantDsf.GetListCustomerGroupPlafondDetailDsfByCustomerGroupPlafondId, obj).subscribe(
      (response) => {

        this.CustGrpPlfndObj = response;

        this.CustGrpPlfndAGRObj = this.CustGrpPlfndObj.filter((obj) => {
          return obj.Category == 'AGR' && (obj.LobCode != 'FACTORING' || obj.LobCode == null);
        });

        this.CustGrpPlfndOPLObj = this.CustGrpPlfndObj.filter((obj) => {
          return obj.Category == 'OPL';
        });

        this.CustGrpPlfndFACTObj = this.CustGrpPlfndObj.filter((obj) => {
          return obj.Category == 'AGR' && obj.LobCode == 'FACTORING';
        });

        this.CustGrpPlfndAPPObj = this.CustGrpPlfndObj.filter((obj) => {
          return obj.Category == 'APP';
        });
      }
    );
  }

  GetExistingPlafondRequestByCustomerGroupPlafondId(){
    var datePipe = new DatePipe("en-US");
    var obj = { CustomerGroupPlafondDsfId: this.CustGrpPlafondId }
    this.http.post(URLConstantDsf.GetExistingReturnByCustomerGroupPlafondId, obj).subscribe(
      (response) => {
        this.resultData = response;
        this.plafondProposalForm.patchValue({
          PlafondMax: this.resultData.PropPlafondMax,
          StartPlafondDate: datePipe.transform(this.resultData.PropDtmStart, "yyyy-MM-dd"),
          EndPlafondDate: datePipe.transform(this.resultData.PropDtmEnd, "yyyy-MM-dd")
        })
      });
  }

  initInputApprovalObj() {
    this.InputObj = new UcInputRFAObj(this.cookieService);
    let Attributes = [{}]
    let TypeCode = {
      "TypeCode": "CUST_GRP_PLAFOND_APV_TYPE",
      "Attributes": Attributes,
    }
    var currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.InputObj.RequestedBy = currentUserContext[CommonConstant.USER_NAME];
    this.InputObj.OfficeCode = currentUserContext[CommonConstant.OFFICE_CODE];
    this.InputObj.ApvTypecodes = [TypeCode];
    this.InputObj.CategoryCode = "CUST_GRP_PLAFOND_APV";
    this.InputObj.SchemeCode = "CUST_GRP_PLAFOND_SCHM";
    this.InputObj.Reason = this.listReason;
    this.InputObj.TrxNo = this.CustGrpNo;
    this.IsReady = true;
  }

  SaveForm():void {
    this.CustGrpPlfnReqDsfObj = new CustGrpPlfndReqDsfObj()
    this.CustGrpPlfnReqDsfObj.CustGrpPlfndDsfId = this.CustGrpPlafondId;
    this.CustGrpPlfnReqDsfObj.CustGrpNo = this.CustGrpNo;
    this.CustGrpPlfnReqDsfObj.PropPlafondMax = this.plafondProposalForm.controls["PlafondMax"].value;
    this.CustGrpPlfnReqDsfObj.PropDtmStart = this.plafondProposalForm.controls["StartPlafondDate"].value;
    this.CustGrpPlfnReqDsfObj.PropDtmEnd = this.plafondProposalForm.controls["EndPlafondDate"].value;
    this.CustGrpPlfnReqDsfObj.RequestRFAObj = {RFAInfo: this.plafondProposalForm.controls.RFAInfo.value}

    if(this.pageType == "add"){
      this.http.post(environment.isCore? URLConstantDsf.AddCustomerGroupPlafondRequestDsfV2 : URLConstantDsf.AddCustomerGroupPlafondRequestDsf, this.CustGrpPlfnReqDsfObj).subscribe(
        (response) => {
          this.toastr.successMessage(response['message']);
          AdInsHelper.RedirectUrl(this.router,[NavigationConstantDsf.CUSTOMER_GROUP_PLAFOND_PAGING],{});
        }
      );
    }
    else if(this.pageType == "edit"){
      this.http.post(environment.isCore? URLConstantDsf.EditCustomerGroupPlafondRequestDsfV2 : URLConstantDsf.EditCustomerGroupPlafondRequestDsf, this.CustGrpPlfnReqDsfObj).subscribe(
        (response) => {
          this.toastr.successMessage(response['message']);
          AdInsHelper.RedirectUrl(this.router,[NavigationConstantDsf.CUSTOMER_GROUP_PLAFOND_PAGING],{});
        }
      );
    }
  }
}
