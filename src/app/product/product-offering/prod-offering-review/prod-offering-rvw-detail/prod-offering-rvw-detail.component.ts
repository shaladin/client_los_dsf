import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { environment } from 'environments/environment';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { UcInputRFAObj } from 'app/shared/model/UcInputRFAObj.Model';
import { UcapprovalcreateComponent } from '@adins/ucapprovalcreate';
import { CookieService } from 'ngx-cookie';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { ResProdOfferingObj } from 'app/shared/model/Response/Product/ResProdOfferingObj.model';
import { ReqReviewProdOfferingObj } from 'app/shared/model/Request/Product/ReqAddEditProdOfferingObj.model';

@Component({
  selector: 'app-prod-offering-rvw-detail',
  templateUrl: './prod-offering-rvw-detail.component.html'
})
export class ProdOfferingRvwDetailComponent implements OnInit {
  private createComponent: UcapprovalcreateComponent;
   @ViewChild('ApprovalComponent') set content(content: UcapprovalcreateComponent) {
    if (content) { 
      // initially setter gets called with undefined
      this.createComponent = content;
    }
  }
  InputObj: UcInputRFAObj
  IsReady: Boolean = false;
  ProdOfferingHId: number;
  WfTaskListId: number;
  ProdOfferingId: number;
  ApprovalCreateOutput: any;
  ReqReviewProdOfferingObj: ReqReviewProdOfferingObj = new ReqReviewProdOfferingObj();

  FormObj = this.fb.group({
    ApprovedById: ['', Validators.required],
    Notes: ['', Validators.required]
  });
  
  constructor(private toastr: NGXToastrService, private http: HttpClient, private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
      if (params["ProdOfferingHId"] != null) {
        this.ProdOfferingHId = params["ProdOfferingHId"];
      }
      if (params["WfTaskListId"] != null) {
        this.WfTaskListId = params["WfTaskListId"];
      }
      if (params["ProdOfferingId"] != null) {
        this.ProdOfferingId = params["ProdOfferingId"];
      }
    });
  }

  ngOnInit() {
    this.initInputApprovalObj();
    this.ClaimTask(this.WfTaskListId);
  }

  initInputApprovalObj() {
    this.InputObj = new UcInputRFAObj(this.cookieService);
    var Attributes = [{}]
    var TypeCode = {
      "TypeCode": CommonConstant.PRD_OFR_APV_TYPE,
      "Attributes": Attributes,
    }
    this.InputObj.ApvTypecodes = [TypeCode];
    this.InputObj.CategoryCode = CommonConstant.CAT_CODE_PRD_OFR_APV;
    this.InputObj.SchemeCode = CommonConstant.SCHM_CODE_APV_OFR_ACT_SCHM;

    this.http.post(URLConstant.GetProdOfferingByProdOfferingId, {Id : this.ProdOfferingId}).subscribe(
      (response : ResProdOfferingObj) => {
        this.InputObj.TrxNo = response.ProdOfferingCode;
        this.IsReady = true;
      });
  }

  SaveForm() {
    this.ApprovalCreateOutput = this.createComponent.output();
    this.ReqReviewProdOfferingObj.ProdOfferingId = this.ProdOfferingId,
    this.ReqReviewProdOfferingObj.ProdOfferingHId = this.ProdOfferingHId,
    this.ReqReviewProdOfferingObj.WfTaskListId = this.WfTaskListId,
    this.ReqReviewProdOfferingObj.RequestRFAObj = this.ApprovalCreateOutput

    this.http.post(URLConstant.ReviewProdOfferingNew, this.ReqReviewProdOfferingObj).subscribe(
      (response) => {
        this.toastr.successMessage("Success");
        AdInsHelper.RedirectUrl(this.router, [NavigationConstant.PRODUCT_OFFERING_REVIEW], {});
      });
  }

  async ClaimTask(WfTaskListId) {
    var currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    var wfClaimObj = { pWFTaskListID: WfTaskListId, pUserID: currentUserContext[CommonConstant.USER_NAME], isLoading: false };
    this.http.post(URLConstant.ClaimTask, wfClaimObj).subscribe(() => { });
  }
}
