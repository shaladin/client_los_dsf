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
import { ProdOfferingBranchMbrObj } from 'app/shared/model/product/prod-offering-branch-mbr-obj.model';

@Component({
  selector: 'app-customer-group-plafond-inquiry-detail',
  templateUrl: './customer-group-plafond-inquiry-detail.component.html',
  styleUrls: ['./customer-group-plafond-inquiry-detail.component.css'],
  providers: [NGXToastrService]
})
export class CustomerGroupPlafondInquiryDetailComponent implements OnInit {

  viewCustomerGroupPlafondInquiryDetailObj: UcViewGenericObj = new UcViewGenericObj();
  CustGrpPlafondId: any;
  CustGrpPlfndObj: any;
  CustGrpPlfndAGRObj: any;
  CustGrpPlfndOPLObj: any;
  CustGrpPlfndFACTObj: any;
  CustGrpPlfndAPPObj: any;
  listReason: any;

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
      if (params['CustGrpPlafondId'] != null) {
        this.CustGrpPlafondId = params['CustGrpPlafondId'];
      }
    });
  }

  async ngOnInit() {
    this.viewCustomerGroupPlafondInquiryDetailObj.viewInput = "./assets/dsf/ucviewgeneric/viewCustomerGroupPlafondInquiryDetail.json";

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
  }

  GetListCustomerGroupPlafondDetailDsfByCustomerGroupPlafondId() {
    var obj = { CustomerGroupPlafondDsfId: this.CustGrpPlafondId }
    this.http.post(URLConstantDsf.GetListCustomerGroupPlafondDetailDsfByCustomerGroupPlafondId, obj).subscribe(
      (response) => {
        this.CustGrpPlfndObj = response;
        this.CustGrpPlfndAGRObj = this.CustGrpPlfndObj.filter((obj) => {
          return obj.Category == 'AGR' && (obj.LobCode != 'FACTORING' || obj.LobCode == null);
        });;
        this.CustGrpPlfndOPLObj = this.CustGrpPlfndObj.filter((obj) => {
          return obj.Category == 'OPL';
        });;
        this.CustGrpPlfndFACTObj = this.CustGrpPlfndObj.filter((obj) => {
          return obj.Category == 'AGR' && obj.LobCode == 'FACTORING';
        });;
        this.CustGrpPlfndAPPObj = this.CustGrpPlfndObj.filter((obj) => {
          return obj.Category == 'APP';
        });;
      }
    );
  }
}
