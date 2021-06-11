import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { MouCustObj } from 'app/shared/model/MouCustObj.Model';
import { RFAInfoObj } from 'app/shared/model/Approval/RFAInfoObj.Model';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcInputRFAObj } from 'app/shared/model/UcInputRFAObj.Model';
import { UcapprovalcreateComponent } from '@adins/ucapprovalcreate';
import { DMSObj } from 'app/shared/model/DMS/DMSObj.model';
import { DMSLabelValueObj } from 'app/shared/model/DMS/DMSLabelValueObj.Model';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { ResSysConfigResultObj } from 'app/shared/model/Response/ResSysConfigResultObj.model';
import { ReqGetByTypeCodeObj } from 'app/shared/model/RefReason/ReqGetByTypeCodeObj.Model';

@Component({
  selector: 'app-mou-review-general',
  templateUrl: './mou-review-general.component.html',
  providers: [NGXToastrService]
})
export class MouReviewGeneralComponent implements OnInit {
  rfaInfoObj: RFAInfoObj = new RFAInfoObj();
  mouCustObj: MouCustObj = new MouCustObj();
  keyValueObj: KeyValueObj;
  MouCustId: number;
  WfTaskListId: any;
  MouType: string = CommonConstant.GENERAL;
  PlafondAmt: number;
  listApprover: any;
  listRecommendationObj: any;
  MrCustTypeCode: any;
  link: any;
  resultData: any;
  mouCustObject: MouCustObj = new MouCustObj();
  listReason: any;
  ScoreResult: number;
  InputObj: UcInputRFAObj = new UcInputRFAObj(this.cookieService);
  IsReady: boolean;
  ApprovalCreateOutput: any;
  UploadViewlink: string;
  Uploadlink: string;
  Viewlink: string;
  dmsObj: DMSObj;
  SysConfigResultObj : ResSysConfigResultObj = new ResSysConfigResultObj();
  RFAInfo: Object = new Object();

  private createComponent: UcapprovalcreateComponent;
  @ViewChild('ApprovalComponent') set content(content: UcapprovalcreateComponent) {
    if (content) {
      // initially setter gets called with undefined
      this.createComponent = content;
    }
  }
  MouReviewDataForm = this.fb.group({
    ListApprover: [''],
    Reason: [''],
    Notes: [''],
    ApvRecommendation: this.fb.array([])
  })

  readonly CancelLink: string = NavigationConstant.MOU_CUST_RVW_PAGING;
  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
      this.MouCustId = params["MouCustId"];
      this.WfTaskListId = params["WfTaskListId"];
    })
  }

  async ngOnInit() : Promise<void>{
    if (this.WfTaskListId > 0) {
      this.claimTask();
    }
    await this.http.post<ResSysConfigResultObj>(URLConstant.GetSysConfigPncplResultByCode, { Code: CommonConstant.ConfigCodeIsUseDms}).toPromise().then(
      (response) => {
        this.SysConfigResultObj = response
      });
    this.mouCustObject.MouCustId = this.MouCustId;
    await this.http.post(URLConstant.GetMouCustById, { Id: this.MouCustId }).toPromise().then(
      (response: MouCustObj) => {
        this.resultData = response;
        let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
        if(this.SysConfigResultObj.ConfigValue == '1'){
          this.dmsObj = new DMSObj();
          this.dmsObj.User = currentUserContext.UserName;
          this.dmsObj.Role = currentUserContext.RoleCode;
          this.dmsObj.ViewCode = CommonConstant.DmsViewCodeMou;
          this.dmsObj.MetadataParent.push(new DMSLabelValueObj(CommonConstant.DmsNoCust, this.resultData['CustNo']));
          if (this.resultData['CustNo'] != null && this.resultData['CustNo'] != "") {
            this.dmsObj.MetadataParent.push(new DMSLabelValueObj(CommonConstant.DmsNoCust, this.resultData['CustNo']));
          }
          else {
            this.dmsObj.MetadataParent.push(new DMSLabelValueObj(CommonConstant.DmsNoCust, this.resultData['ApplicantNo']));
          }
          this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsMouId, this.resultData.MouCustNo));
          this.dmsObj.Option.push(new DMSLabelValueObj(CommonConstant.DmsOverideSecurity, CommonConstant.DmsOverideView));
        }
      }
    );

    var mouCustObj = { Id: this.MouCustId };
    await this.http.post(URLConstant.GetMouCustById, mouCustObj).toPromise().then(
      (response) => {
        this.PlafondAmt = response['PlafondAmt'];
      })

    this.http.post(URLConstant.GetMouCustById, mouCustObj).subscribe(
      (response) => {
        this.MrCustTypeCode = response['MrCustTypeCode'];
      });

    let tempReq: ReqGetByTypeCodeObj = { RefReasonTypeCode: CommonConstant.REF_REASON_MOU_GENERAL };
    await this.http.post(URLConstant.GetListActiveRefReason, tempReq).toPromise().then(
      (response) => {
        this.listReason = response[CommonConstant.ReturnObj];
        this.MouReviewDataForm.patchValue({
          Reason: this.listReason[0].Key
        });
      }
    );

    await this.http.post(URLConstant.GetMouCustScoreByMouCustId, { Id: this.MouCustId }).toPromise().then(
      (response) => {
        this.ScoreResult = response["ScoreResult"];
      }
    );
    this.initInputApprovalObj();
  }

  async claimTask() {
    let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    var wfClaimObj = { pWFTaskListID: this.WfTaskListId, pUserID: currentUserContext[CommonConstant.USER_NAME] };
    this.http.post(URLConstant.ClaimTask, wfClaimObj).subscribe(
      () => {
      });
  }

  Submit() {
    this.RFAInfo = {RFAInfo: this.MouReviewDataForm.controls.RFAInfo.value};
    this.mouCustObj.MouCustId = this.MouCustId;
    this.PlafondAmt = this.PlafondAmt;

    let submitMouReviewObj = {
      WfTaskListId: this.WfTaskListId,
      MouCust: this.mouCustObj,
      PlafondAmt: this.PlafondAmt,
      RequestRFAObj: this.RFAInfo
    }
    this.http.post(URLConstant.SubmitMouReviewNew, submitMouReviewObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        AdInsHelper.RedirectUrl(this.router, [NavigationConstant.MOU_CUST_RVW_PAGING], {});
      })
  }

  Return() {
    var mouObj = { TaskListId: this.WfTaskListId}
    this.http.post(URLConstant.ReturnMouReview, mouObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        AdInsHelper.RedirectUrl(this.router, [NavigationConstant.MOU_CUST_RVW_PAGING], {});
      })
  }

  initInputApprovalObj() {
    var Attributes = []
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
      "TypeCode": "MOUC_GEN_APV_TYPE",
      "Attributes": Attributes,
    };
    this.InputObj.ApvTypecodes = [TypeCode];
    this.InputObj.CategoryCode = CommonConstant.CAT_CODE_MOU_APV_GENERAL;
    this.InputObj.SchemeCode = CommonConstant.SCHM_CODE_MOU_APV_GENERAL;
    this.InputObj.Reason = this.listReason;
    this.InputObj.TrxNo = this.resultData["MouCustNo"]
    this.IsReady = true;
  }
}
