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
  selector: "app-change-mou-review-general",
  templateUrl: "./change-mou-review-general.component.html"
})
export class ChangeMouReviewGeneralComponent implements OnInit {
  rfaInfoObj: RFAInfoObj = new RFAInfoObj();
  mouCustObj: MouCustObj = new MouCustObj();
  keyValueObj: KeyValueObj;
  ChangeMouTrxId: number;
  MouCustId: number;
  TrxNo: string;
  WfTaskListId: number;
  MouType: string = "GENERAL";
  PlafondAmt: number;
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
      "./assets/ucviewgeneric/viewChangeMouHeader.json";
    this.viewGenericObj.viewEnvironment = environment.losUrl;
    this.viewGenericObj.ddlEnvironments = [
      {
        name: "MouCustNo",
        environment: environment.losR3Web,
      },
    ];
    this.viewGenericObj.whereValue = [this.ChangeMouTrxId]

    await this.http
      .post(URLConstant.GetMouCustById, { Id: this.MouCustId })
      .toPromise()
      .then((response: MouCustObj) => {
        this.MrCustTypeCode = response.MrCustTypeCode;
      });
    await this.http
      .post(URLConstant.GetChangeMouCustbyChangeMouTrxId, { Id: this.ChangeMouTrxId })
      .toPromise()
      .then((response: MouCustObj) => {
        this.PlafondAmt = response.PlafondAmt;
      });

    await this.http
      .post(URLConstant.GetListActiveRefReason, {
        RefReasonTypeCode: CommonConstant.REF_REASON_MOU_GENERAL,
      })
      .toPromise()
      .then((response) => {
        this.listReason = response[CommonConstant.ReturnObj];
        this.MouReviewDataForm.patchValue({
          Reason: this.listReason[0],
        });
      });
      await this.http.post(URLConstant.GetMouCustScoreByMouCustId, { Id: this.MouCustId }).toPromise().then(
        (response) => {
          this.ScoreResult = response["ScoreResult"];
        }
      );
    this.initInputApprovalObj();
  }

  MouReviewDataForm = this.fb.group({
    ListApprover: [""],
    Reason: [""],
    Notes: [""],
    ApvRecommendation: this.fb.array([]),
  });

  async claimTask() {
    var currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    var wfClaimObj = {
      pWFTaskListID: this.WfTaskListId,
      pUserID: currentUserContext[CommonConstant.USER_NAME],
    };
    this.http
      .post(URLConstant.ClaimTask, wfClaimObj)
      .subscribe((response) => { });
  }

  Submit() {
    this.ApprovalCreateOutput = {RFAInfo: this.MouReviewDataForm.controls.RFAInfo.value};
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

  Cancel() {
    this.toastr.successMessage("Process Cancel");
    AdInsHelper.RedirectUrl(
      this.router,
      [NavigationConstant.CHANGE_MOU_RVW_PAGING],
      {}
    );
  }

  initInputApprovalObj() {
    this.InputObj = new UcInputRFAObj(this.cookieService);
    var Attributes = [];
    var attribute1 = {
      "AttributeName": "Approval Amount",
      "AttributeValue": this.PlafondAmt
    };

    var attribute2 = {
      "AttributeName": "Scoring",
      "AttributeValue": this.ScoreResult
    };
    Attributes.push(attribute1);
    Attributes.push(attribute2);

    var TypeCode = {
      TypeCode: "CHG_MOU_APV_TYPE",
      Attributes: Attributes,
    };
    var currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
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
