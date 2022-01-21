import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { MouCustObj } from 'app/shared/model/mou-cust-obj.model';
import { RFAInfoObj } from 'app/shared/model/approval/rfa-info-obj.model';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { environment } from 'environments/environment';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcViewGenericObj } from 'app/shared/model/uc-view-generic-obj.model';
import { UcInputRFAObj } from 'app/shared/model/uc-input-rfa-obj.model';
import { UcapprovalcreateComponent } from '@adins/ucapprovalcreate';
import { DMSObj } from 'app/shared/model/dms/dms-obj.model';
import { DMSLabelValueObj } from 'app/shared/model/dms/dms-label-value-obj.model';
import { CookieService } from 'ngx-cookie';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { ClaimTaskService } from 'app/shared/claimTask.service';

@Component({
  selector: 'app-mou-review-dlfn',
  templateUrl: './mou-review-dlfn.component.html',
  providers: [NGXToastrService]
})

export class MouReviewDlfnComponent implements OnInit {
  rfaInfoObj: RFAInfoObj = new RFAInfoObj();
  mouCustObj: MouCustObj = new MouCustObj();
  keyValueObj: KeyValueObj;
  MouCustId: number;
  WfTaskListId: any;
  MouType: string = CommonConstant.FINANCING;
  PlafondAmt: number;
  MrCustTypeCode: string;
  resultData: MouCustObj;
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  listReason: Array<KeyValueObj>;
  ScoreResult: number;
  InputObj: UcInputRFAObj = new UcInputRFAObj(this.cookieService);
  IsReady: boolean;
  RFAInfo: Object = new Object();
  OriOfficeCode: string;

  private createComponent: UcapprovalcreateComponent;
  @ViewChild('ApprovalComponent') set content(content: UcapprovalcreateComponent) {
    if (content) {
      this.createComponent = content;
    }
  }
  ApprovalCreateOutput: any;
  MouReviewDataForm = this.fb.group({
    ListApprover: [''],
    Reason: [''],
    Notes: [''],
    ApvRecommendation: this.fb.array([])
  })
  UploadViewlink: string;
  Uploadlink: string;
  Viewlink: string;
  dmsObj: DMSObj;
  constructor(private fb: FormBuilder, 
              private router: Router, 
              private route: ActivatedRoute, 
              private http: HttpClient, 
              private toastr: NGXToastrService, 
              private cookieService: CookieService,
              private claimTaskService: ClaimTaskService) {
    this.route.queryParams.subscribe(params => {
      this.MouCustId = params["MouCustId"];
      this.WfTaskListId = params["WfTaskListId"];
    })
  }

  async ngOnInit() {
    this.claimTask();
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewMouHeader.json";
    this.viewGenericObj.ddlEnvironments = [
      {
        name: "MouCustNo",
        environment: environment.losR3Web
      },
    ];

    await this.http.post(URLConstant.GetMouCustById, { Id: this.MouCustId }).toPromise().then(
      (response: MouCustObj) => {
        this.resultData = response;
        this.OriOfficeCode = this.resultData.OriOfficeCode;
        this.PlafondAmt = response.PlafondAmt;
        this.MrCustTypeCode = response.MrCustTypeCode;        
        let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
        this.dmsObj = new DMSObj();
        this.dmsObj.User = currentUserContext[CommonConstant.USER_NAME];
        this.dmsObj.Role = currentUserContext[CommonConstant.ROLE_CODE];
        this.dmsObj.ViewCode = CommonConstant.DmsViewCodeMou;
        this.dmsObj.MetadataParent.push(new DMSLabelValueObj(CommonConstant.DmsNoCust, this.resultData['CustNo']));
        this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsMouId, this.resultData.MouCustNo));
        this.dmsObj.Option.push(new DMSLabelValueObj(CommonConstant.DmsOverideSecurity, CommonConstant.DmsOverideViewDownload));

      }
    );

    await this.http.post(URLConstant.GetListActiveRefReason, { RefReasonTypeCode: CommonConstant.REF_REASON_MOU_FINANCING }).toPromise().then(
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

  claimTask() {
    if (environment.isCore) {
      if (this.WfTaskListId != undefined && this.WfTaskListId != "") {
        this.claimTaskService.ClaimTaskV2(this.WfTaskListId);
      }
    } else if (this.WfTaskListId > 0) {
      this.claimTaskService.ClaimTask(this.WfTaskListId);
    }
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

    let SubmitMouReviewNewUrl = environment.isCore ? URLConstant.SubmitMouReviewNewV2 : URLConstant.SubmitMouReviewNew;
    this.http.post(SubmitMouReviewNewUrl, submitMouReviewObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        AdInsHelper.RedirectUrl(this.router, [NavigationConstant.MOU_CUST_RVW_PAGING], {MrMouTypeCode : this.MouType});
      })
  }

  Return() {
    var mouObj = { TaskListId: this.WfTaskListId};
    let ReturnMouReviewUrl = environment.isCore ? URLConstant.ReturnMouReviewV2 : URLConstant.ReturnMouReview;
    this.http.post(ReturnMouReviewUrl, mouObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        AdInsHelper.RedirectUrl(this.router, [NavigationConstant.MOU_CUST_RVW_PAGING], {MrMouTypeCode : this.MouType});
      })
  }

  initInputApprovalObj() {
    this.InputObj = new UcInputRFAObj(this.cookieService);
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
      "TypeCode": "MOUC_DLFN_APV_TYPE",
      "Attributes": Attributes,
    };
    this.InputObj.ApvTypecodes = [TypeCode];
    this.InputObj.CategoryCode = CommonConstant.CAT_CODE_MOU_APV_DLFN;
    this.InputObj.SchemeCode = CommonConstant.SCHM_CODE_MOU_APV_DLFN;
    this.InputObj.Reason = this.listReason;
    this.InputObj.TrxNo = this.resultData["MouCustNo"];
    this.InputObj.OfficeCode = this.OriOfficeCode;
    this.IsReady = true;
  }

}
