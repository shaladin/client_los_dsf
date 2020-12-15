import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { MouCustObj } from 'app/shared/model/MouCustObj.Model';
import { RFAInfoObj } from 'app/shared/model/Approval/RFAInfoObj.Model';
import { KeyValueObj } from 'app/shared/model/KeyValueObj.Model';
import { first } from 'rxjs/operators';
import { environment } from 'environments/environment';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { DMSLabelValueObj } from 'app/shared/model/DMS/DMSLabelValueObj.Model';
import { DMSObj } from 'app/shared/model/DMS/DMSObj.model';

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
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  mouCustObject: MouCustObj = new MouCustObj();
  listReason: any;
  ScoreResult: number;

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
  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService) {
    this.route.queryParams.subscribe(params => {
      this.MouCustId = params["MouCustId"];
      this.WfTaskListId = params["WfTaskListId"];
    })
  }

  ngOnInit() {
    if (this.WfTaskListId > 0) {
      this.claimTask();
    }
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewMouHeader.json";
    this.viewGenericObj.viewEnvironment = environment.losUrl;
    this.viewGenericObj.ddlEnvironments = [
      {
        name: "MouCustNo",
        environment: environment.losR3Web
      },
    ];
    this.mouCustObject.MouCustId = this.MouCustId;
    this.http.post(URLConstant.GetMouCustById, this.mouCustObject).subscribe(
      (response: MouCustObj) => {
        this.resultData = response;
        let currentUserContext = JSON.parse(localStorage.getItem("UserAccess"));
        this.dmsObj = new DMSObj();
        this.dmsObj.User = currentUserContext.UserName;
        this.dmsObj.Role = currentUserContext.RoleCode;
        this.dmsObj.ViewCode = CommonConstant.DmsViewCodeMou;
        this.dmsObj.MetadataParent.push(new DMSLabelValueObj(CommonConstant.DmsNoCust, this.resultData['CustNo']));
        this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsMouId, this.resultData.MouCustNo));
        this.dmsObj.Option.push(new DMSLabelValueObj(CommonConstant.DmsOverideSecurity, CommonConstant.DmsOverideView));
  
      }
    );

    var apvObj = { SchemeCode: 'MOUC_GEN_APV' }
    this.http.post(URLConstant.GetApprovedBy, apvObj).subscribe(
      (response) => {
        this.listApprover = response;

        this.MouReviewDataForm.patchValue({
          ListApprover: this.listApprover[0].Key,
        })
      })

    var listRec = this.MouReviewDataForm.get("ApvRecommendation") as FormArray;
    var apvRecommendObj = { SchemeCode: 'MOUC_GEN_APV' }
    this.http.post(URLConstant.GetRecommendations, apvRecommendObj).subscribe(
      (response) => {
        this.listRecommendationObj = response;
        for (let i = 0; i < this.listRecommendationObj["length"]; i++) {
          var ApvRecommendation = this.fb.group({
            RefRecommendationId: this.listRecommendationObj[i].RefRecommendationId,
            RecommendationCode: this.listRecommendationObj[i].RecommendationCode,
            RecommendationName: this.listRecommendationObj[i].RecommendationName,
            RecommendationValue: ['', Validators.required]
          }) as FormGroup;
          listRec.push(ApvRecommendation);
        }
      })

    var mouCustObj = { MouCustId: this.MouCustId };
    this.http.post(URLConstant.GetMouCustById, mouCustObj).subscribe(
      (response) => {
        this.PlafondAmt = response['PlafondAmt'];
      })

    this.http.post(URLConstant.GetMouCustById, mouCustObj).subscribe(
      (response) => {
        this.MrCustTypeCode = response['MrCustTypeCode'];
      });

    this.http.post(URLConstant.GetListActiveRefReason, { RefReasonTypeCode: CommonConstant.REF_REASON_MOU_GENERAL }).pipe(first()).subscribe(
      (response) => {
        this.listReason = response[CommonConstant.ReturnObj];
        this.MouReviewDataForm.patchValue({
          Reason: this.listReason[0].Key
        });
      }
    );

    this.http.post(URLConstant.GetMouCustScoreByMouCustId, { MouCustId: this.MouCustId}).pipe(first()).subscribe(
      (response) => {
        this.ScoreResult = response["ScoreResult"];
      }
    );
  }

  async claimTask() {
    var currentUserContext = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));
    var wfClaimObj = { pWFTaskListID: this.WfTaskListId, pUserID: currentUserContext[CommonConstant.USER_NAME] };
    this.http.post(URLConstant.ClaimTask, wfClaimObj).subscribe(
      (response) => {
      });
  }

  Submit() {
    this.mouCustObj.MouCustId = this.MouCustId;
    this.PlafondAmt = this.PlafondAmt;

    var ReviewValue = this.MouReviewDataForm.value;
    var ApvRecValue = ReviewValue.ApvRecommendation;

    this.rfaInfoObj.ApprovedById = ReviewValue.ListApprover;
    this.rfaInfoObj.Reason = ReviewValue.Reason;
    this.rfaInfoObj.Notes = ReviewValue.Notes;

    for (let index = 0; index < ApvRecValue.length; index++) {
      this.keyValueObj = new KeyValueObj()
      this.keyValueObj.Key = ApvRecValue[index].RefRecommendationId;
      this.keyValueObj.Value = ApvRecValue[index].RecommendationValue;
      this.rfaInfoObj.RecommendationObj.push(this.keyValueObj);
    }

    var submitMouReviewObj = {
      WfTaskListId: this.WfTaskListId,
      MouCust: this.mouCustObj, Rfa: this.rfaInfoObj,
      PlafondAmt: this.PlafondAmt
    }
    this.http.post(URLConstant.SubmitMouReview, submitMouReviewObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        AdInsHelper.RedirectUrl(this.router,["/Mou/Cust/ReviewPaging"],{});
      })
  }

  Return() {
    var mouObj = { MouCustId: this.MouCustId, WfTaskListId: this.WfTaskListId }
    this.http.post(URLConstant.ReturnMouReview, mouObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        AdInsHelper.RedirectUrl(this.router,["/Mou/Cust/ReviewPaging"],{});
      })
  }

  GetCallBack(event) {
    if (event.Key == "customer") {
      var custObj = { CustNo: this.resultData['CustNo'] };
      this.http.post(URLConstant.GetCustByCustNo, custObj).subscribe(
        response => {
          AdInsHelper.OpenCustomerViewByCustId(response["CustId"]);
        });
    }
  }
}
