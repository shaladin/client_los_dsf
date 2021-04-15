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
import { ReqReviewProductObj } from 'app/shared/model/Request/Product/ReqAddEditProductObj.model';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';

@Component({
  selector: 'app-prod-ho-rvw-detail',
  templateUrl: './prod-ho-rvw-detail.component.html'
})
export class ProdHoRvwDetailComponent implements OnInit {
  private createComponent: UcapprovalcreateComponent;
  @ViewChild('ApprovalComponent') set content(content: UcapprovalcreateComponent) {
    if (content) {
      // initially setter gets called with undefined
      this.createComponent = content;
    }
  }

  ApprovalCreateOutput: any;
  IsReady: Boolean = false;
  ProdId: number;
  WfTaskListId: number;
  ProdHId: number;
  InputObj: UcInputRFAObj = new UcInputRFAObj(this.cookieService);
  GenericByIdObj : GenericObj = new GenericObj();
  ReqReviewProductObj : ReqReviewProductObj = new ReqReviewProductObj();
  readonly CancelLink: string = NavigationConstant.PRODUCT_HO_REVIEW;
  
  FormObj = this.fb.group({
    Notes: ['', Validators.required]
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

  ngOnInit() {
    this.ClaimTask(this.WfTaskListId);
    this.initInputApprovalObj();
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

    this.GenericByIdObj.Id = this.ProdId;
    this.http.post(URLConstant.GetProductById, this.GenericByIdObj).subscribe(
      (response: GenericObj) => {
        this.InputObj.TrxNo = response.Code;
        this.IsReady = true;
      });
  }

  SaveForm() {
    this.ApprovalCreateOutput = this.createComponent.output();
    if (this.ApprovalCreateOutput != undefined) {
      this.ReqReviewProductObj.ProdHId = this.ProdHId,
      this.ReqReviewProductObj.ProdId = this.ProdId,
      this.ReqReviewProductObj.WfTaskListId = this.WfTaskListId,
      this.ReqReviewProductObj.RequestRFAObj = this.ApprovalCreateOutput

      this.http.post(URLConstant.ReviewProduct, this.ReqReviewProductObj).subscribe(
        (response) => {
          this.toastr.successMessage(response["Message"]);
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.PRODUCT_HO_REVIEW], {});
          this.IsReady = true;
        });
    }
  }
  async ClaimTask(WfTaskListId) {
    let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    var wfClaimObj = { pWFTaskListID: WfTaskListId, pUserID: currentUserContext[CommonConstant.USER_NAME], isLoading: false };
    this.http.post(URLConstant.ClaimTask, wfClaimObj).subscribe(() => { });
  }
}
