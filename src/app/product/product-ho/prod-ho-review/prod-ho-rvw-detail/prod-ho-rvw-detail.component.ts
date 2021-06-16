import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { UcInputRFAObj } from 'app/shared/model/UcInputRFAObj.Model';
import { UcapprovalcreateComponent } from '@adins/ucapprovalcreate';
import { CookieService } from 'ngx-cookie';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { ReqReviewProductObj } from 'app/shared/model/Request/Product/ReqAddEditProductObj.model';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';
import { ReqGetByTypeCodeObj } from 'app/shared/model/RefReason/ReqGetByTypeCodeObj.Model';

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
  WfTaskListId: number;
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
              private cookieService: CookieService) {
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
    this.ClaimTask(this.WfTaskListId);
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

    this.http.post(URLConstant.ReviewProduct, this.ReqReviewProductObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["Message"]);
        AdInsHelper.RedirectUrl(this.router, [NavigationConstant.PRODUCT_HO_REVIEW], {});
        this.IsReady = true;
      });
  }
  async ClaimTask(WfTaskListId: number) {
    let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    let wfClaimObj = { pWFTaskListID: WfTaskListId, pUserID: currentUserContext[CommonConstant.USER_NAME], isLoading: false };
    this.http.post(URLConstant.ClaimTask, wfClaimObj).subscribe(() => { });
  }
}
