import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { MouCustObj } from "app/shared/model/MouCustObj.Model";
import { RFAInfoObj } from "app/shared/model/Approval/RFAInfoObj.Model";
import { KeyValueObj } from "app/shared/model/KeyValue/KeyValueObj.Model";
import { AdInsHelper } from "app/shared/AdInsHelper";
import { CommonConstant } from "app/shared/constant/CommonConstant";
import { URLConstant } from "app/shared/constant/URLConstant";
import { UcViewGenericObj } from "app/shared/model/UcViewGenericObj.model";
import { environment } from "environments/environment";
import { UcInputRFAObj } from "app/shared/model/UcInputRFAObj.Model";
import { UcapprovalcreateComponent } from "@adins/ucapprovalcreate";
import { CookieService } from "ngx-cookie";
import { ReqGetByTypeCodeObj } from "app/shared/model/RefReason/ReqGetByTypeCodeObj.Model";
import { NavigationConstant } from "app/shared/constant/NavigationConstant";

@Component({
  selector: "app-change-mou-review-financing",
  templateUrl: "./change-mou-review-financing.component.html"
})
export class ChangeMouReviewFinancingComponent implements OnInit {
  rfaInfoObj: RFAInfoObj = new RFAInfoObj();
  mouCustObj: MouCustObj = new MouCustObj();
  mouCustObject: MouCustObj = new MouCustObj();
  keyValueObj: KeyValueObj;
  ChangeMouTrxId: number;
  MouCustId: number;
  TrxNo: string;
  WfTaskListId: number;
  MouType: string = "FINANCING";
  PlafondAmt: number;
  listApprover: any;
  MrCustTypeCode: string;
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  listReason: Array<ReqGetByTypeCodeObj>; 
  ScoreResult: number;
  InputObj: UcInputRFAObj;
  IsReady: boolean;
  private createComponent: UcapprovalcreateComponent;
  @ViewChild("ApprovalComponent") set content(
    content: UcapprovalcreateComponent
  ) {
    if (content) {
      this.createComponent = content;
    }
  }
  ApprovalCreateOutput: any;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private toastr: NGXToastrService,
    private cookieService: CookieService
  ) {
    this.route.queryParams.subscribe((params) => {
      this.ChangeMouTrxId = params["ChangeMouTrxId"];
      this.MouCustId = params["MouCustId"];
      this.WfTaskListId = params["WfTaskListId"];
      this.TrxNo = params["TrxNo"];
    });
  }

  async ngOnInit() {
    if (this.WfTaskListId > 0) {
      this.claimTask();
    }
    this.viewGenericObj.viewInput =
      "./assets/ucviewgeneric/viewMouHeaderFactoring.json";
    this.viewGenericObj.viewEnvironment = environment.losUrl;
    this.viewGenericObj.ddlEnvironments = [
      {
        name: "MouCustNo",
        environment: environment.losR3Web,
      },
    ];

    var mouCustObj = { MouCustId: this.MouCustId };
    await this.http
      .post(URLConstant.GetMouCustById, mouCustObj)
      .toPromise()
      .then((response) => {
        this.PlafondAmt = response["PlafondAmt"];
        console.log("tes" + this.PlafondAmt);
      });
    this.http
      .post(URLConstant.GetMouCustById, mouCustObj)
      .subscribe((response) => {
        this.MrCustTypeCode = response["MrCustTypeCode"];
      });

    await this.http
      .post(URLConstant.GetListActiveRefReason, {
        RefReasonTypeCode: CommonConstant.REF_REASON_MOU_FINANCING,
      })
      .toPromise()
      .then((response) => {
        this.listReason = response[CommonConstant.ReturnObj];
        this.MouReviewDataForm.patchValue({
          Reason: this.listReason[0],
        });
      });

    this.initInputApprovalObj();
  }

  MouReviewDataForm = this.fb.group({
    ListApprover: [""],
    Reason: [""],
    Notes: [""],
    ApvRecommendation: this.fb.array([]),
  });

  async claimTask() {
    var currentUserContext = JSON.parse(
      localStorage.getItem(CommonConstant.USER_ACCESS)
    );
    var wfClaimObj = {
      pWFTaskListID: this.WfTaskListId,
      pUserID: currentUserContext[CommonConstant.USER_NAME],
    };
    this.http
      .post(URLConstant.ClaimTask, wfClaimObj)
      .subscribe((response) => { });
  }

  Submit() {
    this.ApprovalCreateOutput = this.createComponent.output();
    if (this.ApprovalCreateOutput != undefined) {
      this.mouCustObj.MouCustId = this.MouCustId;
      this.PlafondAmt = this.PlafondAmt;

      var submitMouReviewObj = {
        WfTaskListId: this.WfTaskListId,
        MouCust: this.mouCustObj,
        PlafondAmt: this.PlafondAmt,
        RequestRFAObj: this.ApprovalCreateOutput,
      };
      this.http
        .post(URLConstant.SubmitChangeMouReview, submitMouReviewObj)
        .subscribe((response) => {
          this.toastr.successMessage(response["message"]);
          AdInsHelper.RedirectUrl(
            this.router,
            [NavigationConstant.CHANGE_MOU_RVW_PAGING],
            {}
          );
        });
    }
  }

  Return() {
    var mouObj = { 
      WfTaskListId: this.WfTaskListId,
      ChangeMouTrxId : this.ChangeMouTrxId
    };
    this.http
      .post(URLConstant.ReturnChangeMouReview, mouObj)
      .subscribe((response) => {
        this.toastr.successMessage(response["message"]);
        AdInsHelper.RedirectUrl(
          this.router,
          [NavigationConstant.CHANGE_MOU_RVW_PAGING],
          {}
        );
      });
  }

  Cancel() {
    this.toastr.successMessage("Process Cancel");
    AdInsHelper.RedirectUrl(
      this.router,
      [NavigationConstant.CHANGE_MOU_RVW_PAGING],
      {}
    );
  }

  GetCallBack(event) {
    if (event.Key == "customer") {
      var custObj = { CustNo: event.ViewObj["CustNo"] };
      this.http
        .post(URLConstant.GetCustByCustNo, custObj)
        .subscribe((response) => {
          AdInsHelper.OpenCustomerViewByCustId(response["CustId"]);
        });
    }
  }

  initInputApprovalObj() {
    this.InputObj = new UcInputRFAObj(this.cookieService);
    var Attributes = [];
    var attribute1 = {
      AttributeName: "PlafondAmt",
      AttributeValue: this.PlafondAmt,
    };
    Attributes.push(attribute1);

    var TypeCode = {
      TypeCode: "CHG_MOU_APV_TYPE",
      Attributes: Attributes,
    };
    var currentUserContext = JSON.parse(
      localStorage.getItem(CommonConstant.USER_ACCESS)
    );
    this.InputObj.RequestedBy = currentUserContext[CommonConstant.USER_NAME];
    this.InputObj.OfficeCode = currentUserContext[CommonConstant.OFFICE_CODE];
    this.InputObj.ApvTypecodes = [TypeCode];
    this.InputObj.EnvUrl = environment.FoundationR3Url;
    this.InputObj.PathUrlGetSchemeBySchemeCode =
      URLConstant.GetSchemesBySchemeCode;
    this.InputObj.PathUrlGetCategoryByCategoryCode =
      URLConstant.GetRefSingleCategoryByCategoryCode;
    this.InputObj.PathUrlGetAdtQuestion = URLConstant.GetRefAdtQuestion;
    this.InputObj.PathUrlGetPossibleMemberAndAttributeExType =
      URLConstant.GetPossibleMemberAndAttributeExType;
    this.InputObj.PathUrlGetApprovalReturnHistory =
      URLConstant.GetApprovalReturnHistory;
    this.InputObj.PathUrlCreateNewRFA = URLConstant.CreateNewRFA;
    this.InputObj.PathUrlCreateJumpRFA = URLConstant.CreateJumpRFA;
    this.InputObj.CategoryCode = CommonConstant.CAT_CODE_CHG_MOU_APV;
    this.InputObj.SchemeCode = CommonConstant.SCHM_CODE_CHG_MOU_APV;
    this.InputObj.Reason = this.listReason;
    this.InputObj.TrxNo = this.TrxNo;
    this.IsReady = true;
  }
}
