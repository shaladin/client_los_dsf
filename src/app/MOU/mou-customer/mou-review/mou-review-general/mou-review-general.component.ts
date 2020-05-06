import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { MouCustObj } from 'app/shared/model/MouCustObj.Model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { RFAInfoObj } from 'app/shared/model/Approval/RFAInfoObj.Model';
import { KeyValueObj } from 'app/shared/model/KeyValueObj.Model';

@Component({
  selector: 'app-mou-review-general',
  templateUrl: './mou-review-general.component.html',
  providers: [NGXToastrService]
})
export class MouReviewGeneralComponent implements OnInit {
  rfaInfoObj: RFAInfoObj = new RFAInfoObj();
  mouCustObj: MouCustObj = new MouCustObj();
  keyValueObj: KeyValueObj;
  MouCustId: any;
  WfTaskListId: any;
  MouType: string = "GENERAL";
  PlafondAmt: any;
  listApprover: any;
  listRecommendationObj: any;

  listReason: any = [
    {
      Key: "OTHR_RSN",
      Value: "Reason 1"
    },
    {
      Key: "REASON2",
      Value: "Reason 3"
    },
    {
      Key: "REASON2",
      Value: "Reason 3"
    },
  ];

  MouReviewDataForm = this.fb.group({
    ListApprover: [''],
    Reason: [''],
    Notes: [''],
    ApvRecommendation: this.fb.array([])
  })

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService) {
    this.route.queryParams.subscribe(params => {
      this.MouCustId = params["MouCustId"];
      this.WfTaskListId = params["WfTaskListId"];
    })
  }

  ngOnInit() {
    this.claimTask();

    var apvObj = { SchemeCode: 'MOUC_GEN_APV' }
    this.http.post(AdInsConstant.GetApprovedBy, apvObj).subscribe(
      (response) => {
        console.log(apvObj);
        this.listApprover = response;

        this.MouReviewDataForm.patchValue({
          ListApprover: this.listApprover[0].Key,
          Reason: this.listReason[0].Key
        })
      })

    var listRec = this.MouReviewDataForm.get("ApvRecommendation") as FormArray;
    var apvRecommendObj = { SchemeCode: 'MOUC_GEN_APV' }
    this.http.post(AdInsConstant.GetRecommendations, apvRecommendObj).subscribe(
      (response) => {
        this.listRecommendationObj = response;
        for (let i = 0; i < this.listRecommendationObj["length"]; i++) {
          var ApvRecommendation = this.fb.group({
            RefRecommendationId: this.listRecommendationObj[i].RefRecommendationId,
            RecommendationCode: this.listRecommendationObj[i].RecommendationCode,
            RecommendationName: this.listRecommendationObj[i].RecommendationName,
            RecommendationValue: ""
          }) as FormGroup;
          listRec.push(ApvRecommendation);
        }
        // this.ApvRecommendation = ApvRecommendation;
        console.log(this.MouReviewDataForm);
      })

    var mouCustObj = { MouCustId: this.MouCustId };
    this.http.post(AdInsConstant.GetMouCustById, mouCustObj).subscribe(
      (response) => {
        this.PlafondAmt = response['PlafondAmt'];
      })
  }

  async claimTask() {
    var currentUserContext = JSON.parse(localStorage.getItem("UserContext"));
    var wfClaimObj = { pWFTaskListID: this.WfTaskListId, pUserID: currentUserContext["UserName"] };
    console.log(wfClaimObj);
    this.http.post(AdInsConstant.ClaimTask, wfClaimObj).subscribe(
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
      MouCust: this.mouCustObj, Rfa: this.rfaInfoObj
    }
    this.http.post(AdInsConstant.SubmitMouReview, submitMouReviewObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        this.router.navigate(["/Mou/Cust/ReviewPaging"]);
      })
  }

  Return() {
    var mouObj = { MouCustId: this.MouCustId, WfTaskListId: this.WfTaskListId }
    this.http.post(AdInsConstant.ReturnMouReview, mouObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        this.router.navigate(["/Mou/Cust/ReviewPaging"]);
      })
  }
}
