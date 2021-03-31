import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { environment } from 'environments/environment';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { UcInputRFAObj } from 'app/shared/model/UcInputRFAObj.Model';
import { UcapprovalcreateComponent } from '@adins/Ucapprovalcreate';
import { CookieService } from 'ngx-cookie';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';

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
  InputObj: UcInputRFAObj;
  IsReady: Boolean = false;
  ProdOfferingHId: number;
  WfTaskListId: number;
  ProdOfferingId: number;
  ApprovalCreateOutput: any;
  FormObj = this.fb.group({
    ApprovedById: ['', Validators.required],
    Notes: ['', Validators.required]
  });
  
  readonly CancelLink: string = NavigationConstant.PRODUCT_OFFERING_REVIEW;
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
  apvBaseUrl = environment.ApprovalR3Url;
  ngOnInit() {
    this.initInputApprovalObj();
    this.ClaimTask(this.WfTaskListId);
  }

  initInputApprovalObj() {
    this.InputObj = new UcInputRFAObj();
    var Attributes = [{}]
    var TypeCode = {
      "TypeCode": CommonConstant.PRD_OFR_APV_TYPE,
      "Attributes": Attributes,
    }
    var currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.InputObj.RequestedBy = currentUserContext[CommonConstant.USER_NAME];
    this.InputObj.OfficeCode = currentUserContext[CommonConstant.OFFICE_CODE];
    this.InputObj.ApvTypecodes = [TypeCode];
    this.InputObj.EnvUrl = environment.FoundationR3Url;
    this.InputObj.PathUrlGetSchemeBySchemeCode = URLConstant.GetSchemesBySchemeCode;
    this.InputObj.PathUrlGetCategoryByCategoryCode = URLConstant.GetRefSingleCategoryByCategoryCode;
    this.InputObj.PathUrlGetAdtQuestion = URLConstant.GetRefAdtQuestion;
    this.InputObj.PathUrlGetPossibleMemberAndAttributeExType = URLConstant.GetPossibleMemberAndAttributeExType;
    this.InputObj.PathUrlGetApprovalReturnHistory = URLConstant.GetApprovalReturnHistory;
    this.InputObj.PathUrlCreateNewRFA = URLConstant.CreateNewRFA;
    this.InputObj.PathUrlCreateJumpRFA = URLConstant.CreateJumpRFA;
    this.InputObj.CategoryCode = CommonConstant.CAT_CODE_PRD_OFR_APV;
    this.InputObj.SchemeCode = CommonConstant.SCHM_CODE_APV_OFR_ACT_SCHM;

    this.http.post(URLConstant.GetProdOfferingByProdOfferingId, {Id : this.ProdOfferingId}).subscribe(
      (response) => {
        this.InputObj.TrxNo = response["ProdOfferingCode"];
        this.IsReady = true;
      });
  }

  SaveForm() {
    this.ApprovalCreateOutput = this.createComponent.output();
    var data = {
      ProdOfferingId: this.ProdOfferingId,
      ProdOfferingHId: this.ProdOfferingHId,
      WfTaskListId: this.WfTaskListId,
      RequestRFAObj: this.ApprovalCreateOutput
    }
    this.http.post(URLConstant.ReviewProdOfferingNew, data).subscribe(
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
