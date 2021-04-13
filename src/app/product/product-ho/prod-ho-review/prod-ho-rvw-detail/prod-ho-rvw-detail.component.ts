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
import { ResProductObj } from 'app/shared/model/Response/Product/ResProductObj.Model';

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
  InputObj: UcInputRFAObj = new UcInputRFAObj(this.cookieService);
  IsReady: Boolean = false;
  ProdId: number;
  WfTaskListId: number;
  ProdHId: number;
  FormObj = this.fb.group({
    Notes: ['', Validators.required]
  });

  readonly CancelLink: string = NavigationConstant.PRODUCT_HO_REVIEW;
  constructor(private toastr: NGXToastrService, private http: HttpClient, private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private cookieService: CookieService) {
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
    console.log(this.InputObj);

    this.http.post(URLConstant.GetProductById, { Id: this.ProdId }).subscribe(
      (response: ResProductObj) => {
        this.InputObj.TrxNo = response.ProdCode;
        this.IsReady = true;
      });
  }

  SaveForm() {
    this.ApprovalCreateOutput = this.createComponent.output();
    if (this.ApprovalCreateOutput != undefined) {
      let data = {
        ProdHId: this.ProdHId,
        ProdId: this.ProdId,
        WfTaskListId: this.WfTaskListId,
        RequestRFAObj: this.ApprovalCreateOutput
      }
      this.http.post(URLConstant.ReviewProductNew, data).subscribe(
        (response) => {
          this.toastr.successMessage("Success");
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
