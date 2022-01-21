import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { UcInputRFAObj } from 'app/shared/model/uc-input-rfa-obj.model';
import { UcapprovalcreateComponent } from '@adins/ucapprovalcreate';
import { CookieService } from 'ngx-cookie';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { ReqReviewProdOfferingObj} from 'app/shared/model/request/product/req-add-edit-prod-offering-obj.model';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { ReqGetByTypeCodeObj } from 'app/shared/model/ref-reason/req-get-by-type-code-obj.model';
import { ClaimTaskService } from 'app/shared/claimTask.service';
import { environment } from 'environments/environment';

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
  WfTaskListId: any;
  ProdOfferingId: number;
  ApprovalCreateOutput: any;
  GenericByIdObj: GenericObj = new GenericObj();
  ReqReviewProdOfferingObj: ReqReviewProdOfferingObj = new ReqReviewProdOfferingObj();
  RFAInfo: Object = new Object();
  itemReason: any;
  OriOfficeCode: string;
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
    this.claimTask();
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
      (response) => {
        this.InputObj.TrxNo = response["ProdOfferingCode"];
        this.InputObj.OfficeCode = response["OfficeCode"];
        this.IsReady = true;
      });
  }

  SaveForm() {
      this.RFAInfo = {RFAInfo: this.FormObj.controls.RFAInfo.value};
      this.ReqReviewProdOfferingObj.ProdOfferingId = this.ProdOfferingId;
      this.ReqReviewProdOfferingObj.ProdOfferingHId = this.ProdOfferingHId;
      this.ReqReviewProdOfferingObj.WfTaskListId = this.WfTaskListId;
      this.ReqReviewProdOfferingObj.RequestRFAObj = this.RFAInfo;
  
      let urlPost = environment.isCore? URLConstant.ReviewProdOfferingV2 : URLConstant.ReviewProdOffering;
      this.http.post(urlPost, this.ReqReviewProdOfferingObj).subscribe(
        (response) => {
          this.toastr.successMessage(response["Message"]);
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.PRODUCT_OFFERING_REVIEW], {});
      });
  }

  claimTask() {
    if (environment.isCore) {
      if (this.WfTaskListId != "" && this.WfTaskListId != undefined) {
        this.claimTaskService.ClaimTaskV2(this.WfTaskListId);
      }
    }
    else if (this.WfTaskListId > 0) {
      this.claimTaskService.ClaimTask(this.WfTaskListId);
    }
  }
}
