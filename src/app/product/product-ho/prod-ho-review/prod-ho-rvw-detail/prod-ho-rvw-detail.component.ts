import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { UcInputRFAObj } from 'app/shared/model/uc-input-rfa-obj.model';
import { UcapprovalcreateComponent } from '@adins/ucapprovalcreate';
import { CookieService } from 'ngx-cookie';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { ReqReviewProductObj } from 'app/shared/model/request/product/req-add-edit-product-obj.model';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { ReqGetByTypeCodeObj } from 'app/shared/model/ref-reason/req-get-by-type-code-obj.model';
import { ClaimTaskService } from 'app/shared/claimTask.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-prod-ho-rvw-detail',
  templateUrl: './prod-ho-rvw-detail.component.html'
})
export class ProdHoRvwDetailComponent implements OnInit {
  private CreateComponent: UcapprovalcreateComponent;
  @ViewChild('ApprovalComponent') set content(Content: UcapprovalcreateComponent) {
    if (Content) {
      // initially setter gets called with undefined
      this.CreateComponent = Content;
    }
  }

  ProdId: number;
  ProdHId: number;
  WfTaskListId: any;
  IsReady: Boolean = false;
  ApprovalCreateOutput: any;
  InputObj: UcInputRFAObj = new UcInputRFAObj(this.cookieService);
  GenericByIdObj : GenericObj = new GenericObj();
  ReqReviewProductObj : ReqReviewProductObj = new ReqReviewProductObj();
  RFAInfo: Object = new Object();
  itemReason: any;
  readonly CancelLink: string = NavigationConstant.PRODUCT_HO_REVIEW;
  
  FormObj = this.fb.group({
    
  });
  
  constructor(private toastr: NGXToastrService, 
              private http: HttpClient, 
              private fb: FormBuilder, 
              private router: Router, 
              private route: ActivatedRoute, 
              private cookieService: CookieService,
              private claimTaskService: ClaimTaskService) {
    this.route.queryParams.subscribe(params => {
      if (params["ProdId"] != null) {
        this.ProdId = params["ProdId"];
      }
      if (params["WfTaskListId"] != null) {
        this.WfTaskListId = params["WfTaskListId"];
      }
      if (params["ProdHId"] != null) {
        this.ProdHId = params["ProdHId"];
      }
    });

  }

  async ngOnInit() {
    let context = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    if (context[CommonConstant.MR_OFFICE_TYPE_CODE] != CommonConstant.HeadOffice) {
      this.router.navigate([NavigationConstant.PROD_HO_UNAUTHORIZED], { queryParams: {}, skipLocationChange: false });
    }
    
    if(environment.isCore){ 
      this.claimTaskService.ClaimTaskV2(this.WfTaskListId);
    }else{
      this.claimTaskService.ClaimTask(this.WfTaskListId);
    }
    await this.LoadRefReason();
    this.initInputApprovalObj();
  }

  async LoadRefReason() {
    let refReasonObj: ReqGetByTypeCodeObj = {
      RefReasonTypeCode: CommonConstant.RefReasonTypeCodeNewProduct
    }
    await this.http.post(URLConstant.GetListActiveRefReason, refReasonObj).toPromise().then(
      (response) => {
        this.itemReason = response[CommonConstant.ReturnObj];
      }
    );
  }

  initInputApprovalObj() {
    this.InputObj.ApvTypecodes = [
      {
        "TypeCode": CommonConstant.PRD_HO_APV_TYPE,
        "Attributes": [{}],
      }
    ];
    this.InputObj.CategoryCode = CommonConstant.CAT_CODE_PRD_HO_APV;
    this.InputObj.SchemeCode = CommonConstant.SCHM_CODE_APV_HO_ACT_SCHM;
    this.InputObj.Reason = this.itemReason;

    this.GenericByIdObj.Id = this.ProdId;
    this.http.post(URLConstant.GetProductById, this.GenericByIdObj).subscribe(
      (response: GenericObj) => {
        this.InputObj.TrxNo = response.Code;
        this.IsReady = true;
      });
  }

  SaveForm() {
    this.RFAInfo = {RFAInfo: this.FormObj.controls.RFAInfo.value};
    this.ReqReviewProductObj.ProdHId = this.ProdHId;
    this.ReqReviewProductObj.ProdId = this.ProdId;
    this.ReqReviewProductObj.WfTaskListId = this.WfTaskListId;
    this.ReqReviewProductObj.RequestRFAObj = this.RFAInfo;

    let ReviewProductUrl = environment.isCore ? URLConstant.ReviewProductV2 : URLConstant.ReviewProduct;
    this.http.post(ReviewProductUrl, this.ReqReviewProductObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["Message"]);
        AdInsHelper.RedirectUrl(this.router, [NavigationConstant.PRODUCT_HO_REVIEW], {});
        this.IsReady = true;
      });
  }
}
