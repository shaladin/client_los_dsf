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
import { ClaimTaskService } from "app/shared/claimTask.service";

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
  WfTaskListId: any;
  MouType: string = "FINANCING";
  PlafondAmt: number;
  MrCustTypeCode: string;
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  listReason: Array<ReqGetByTypeCodeObj>; 
  ScoreResult: number;
  InputObj: UcInputRFAObj;
  IsReady: boolean;
  ChangeMouCustId: number;
  TrxType: string;
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
    private cookieService: CookieService,
    private claimTaskService: ClaimTaskService
  ) {
    this.route.queryParams.subscribe((params) => {
      this.ChangeMouTrxId = params["ChangeMouTrxId"];
      this.MouCustId = params["MouCustId"];
      this.WfTaskListId = params["WfTaskListId"];
      this.TrxNo = params["TrxNo"];
      this.ChangeMouCustId = params["ChangeMouCustId"];
      this.TrxType = params["TrxType"];
    });
  }

  async ngOnInit() {
    this.claimTask();
      
    this.viewGenericObj.viewInput =
      "./assets/ucviewgeneric/viewChangeMouHeader.json";
    this.viewGenericObj.ddlEnvironments = [
      {
        name: "MouCustNo",
        environment: environment.losR3Web,
      },
    ];
    this.viewGenericObj.whereValue = [this.ChangeMouCustId]

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
        RefReasonTypeCode: CommonConstant.REF_REASON_MOU_FINANCING,
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
    if(environment.isCore){
      if(this.WfTaskListId != "" && this.WfTaskListId != undefined){
        this.claimTaskService.ClaimTaskV2(this.WfTaskListId);
      }
    }
    if (this.WfTaskListId > 0){
        this.claimTaskService.ClaimTask(this.WfTaskListId);
    }
  }

  Submit() {
      let urlPost = environment.isCore ? URLConstant.SubmitChangeMouReviewV2 : URLConstant.SubmitChangeMouReview;

      this.ApprovalCreateOutput = {RFAInfo: this.MouReviewDataForm.controls.RFAInfo.value};
      this.mouCustObj.MouCustId = this.MouCustId;

      var submitMouReviewObj = {
        WfTaskListId: this.WfTaskListId,
        MouCust: this.mouCustObj,
        RequestRFAObj: this.ApprovalCreateOutput,
      };
      this.http
        .post(urlPost, submitMouReviewObj)
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
    let urlPost = environment.isCore ? URLConstant.ReturnChangeMouReviewV2 : URLConstant.ReturnChangeMouReview;
    var mouObj = { 
      WfTaskListId: this.WfTaskListId,
      ChangeMouTrxId : this.ChangeMouTrxId
    };
    this.http
      .post(urlPost, mouObj)
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
          if(response["MrCustTypeCode"] == CommonConstant.CustTypePersonal){
            AdInsHelper.OpenCustomerViewByCustId(response["CustId"]);
          }
          if(response["MrCustTypeCode"] == CommonConstant.CustTypeCompany){
            AdInsHelper.OpenCustomerCoyViewByCustId(response["CustId"]);
          }
        });
    }
  }

  initInputApprovalObj() {
    this.InputObj = new UcInputRFAObj(this.cookieService);
    var Attributes = [
      {
        "AttributeName": "Plafond Amount",
        "AttributeValue": this.PlafondAmt
      },
      {
        "AttributeName": "Scoring",
        "AttributeValue": this.ScoreResult
      }
    ];

    var TypeCode = {
      TypeCode: CommonConstant.APV_TYPE_CHG_MOU_APV_TYPE,
      Attributes: Attributes,
    };
    var currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.InputObj.RequestedBy = currentUserContext[CommonConstant.USER_NAME];
    this.InputObj.OfficeCode = currentUserContext[CommonConstant.OFFICE_CODE];
    this.InputObj.ApvTypecodes = [TypeCode];
    this.InputObj.CategoryCode = CommonConstant.CAT_CODE_CHG_MOU_APV;
    this.InputObj.SchemeCode = CommonConstant.SCHM_CODE_CHG_MOU_APV;
    this.InputObj.Reason = this.listReason;
    this.InputObj.TrxNo = this.TrxNo;
    this.IsReady = true;
  }
}
