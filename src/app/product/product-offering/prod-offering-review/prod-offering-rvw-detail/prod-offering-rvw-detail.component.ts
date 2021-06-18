import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { UcInputRFAObj } from 'app/shared/model/UcInputRFAObj.Model';
import { UcapprovalcreateComponent } from '@adins/ucapprovalcreate';
import { CookieService } from 'ngx-cookie';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { ReqReviewProdOfferingObj } from 'app/shared/model/Request/Product/ReqAddEditProdOfferingObj.model';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';
import { ReqGetByTypeCodeObj } from 'app/shared/model/RefReason/ReqGetByTypeCodeObj.Model';
import { ClaimTaskService } from 'app/shared/claimTask.service';

@Component({
  selector: 'app-prod-offering-rvw-detail',
  templateUrl: './prod-offering-rvw-detail.component.html'
})
export class ProdOfferingRvwDetailComponent implements OnInit {
  private CreateComponent: UcapprovalcreateComponent;
   @ViewChild('ApprovalComponent') set content(content: UcapprovalcreateComponent) {
    if (content) { 
      // initially setter gets called with undefined
      this.CreateComponent = content;
    }
  }
  InputObj: UcInputRFAObj = new UcInputRFAObj(this.cookieService);
  IsReady: Boolean = false;
  ProdOfferingHId: number;
  WfTaskListId: number;
  ProdOfferingId: number;
  ApprovalCreateOutput: any;
  GenericByIdObj: GenericObj = new GenericObj();
  ReqReviewProdOfferingObj: ReqReviewProdOfferingObj = new ReqReviewProdOfferingObj();
  RFAInfo: Object = new Object();
  itemReason: any;
  readonly CancelLink: string = NavigationConstant.PRODUCT_OFFERING_REVIEW;

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

  async ngOnInit() {
    await this.LoadRefReason();
    this.initInputApprovalObj();
    this.claimTaskService.ClaimTask(this.WfTaskListId);
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
    let Attributes = [{}]
    let TypeCode = {
      "TypeCode": CommonConstant.PRD_OFR_APV_TYPE,
      "Attributes": Attributes,
    }
    this.InputObj.ApvTypecodes = [TypeCode];
    this.InputObj.CategoryCode = CommonConstant.CAT_CODE_PRD_OFR_APV;
    this.InputObj.SchemeCode = CommonConstant.SCHM_CODE_APV_OFR_ACT_SCHM;
    this.InputObj.Reason = this.itemReason;

    this.GenericByIdObj.Id = this.ProdOfferingId;
    this.http.post(URLConstant.GetProdOfferingByProdOfferingId, this.GenericByIdObj).subscribe(
      (response : GenericObj) => {
        this.InputObj.TrxNo = response.Code;
        this.IsReady = true;
      });
  }

  SaveForm() {
    this.RFAInfo = {RFAInfo: this.FormObj.controls.RFAInfo.value};
    this.ReqReviewProdOfferingObj.ProdOfferingId = this.ProdOfferingId;
    this.ReqReviewProdOfferingObj.ProdOfferingHId = this.ProdOfferingHId;
    this.ReqReviewProdOfferingObj.WfTaskListId = this.WfTaskListId;
    this.ReqReviewProdOfferingObj.RequestRFAObj = this.RFAInfo;

    this.http.post(URLConstant.ReviewProdOffering, this.ReqReviewProdOfferingObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["Message"]);
        AdInsHelper.RedirectUrl(this.router, [NavigationConstant.PRODUCT_OFFERING_REVIEW], {});
      });
  }
}
