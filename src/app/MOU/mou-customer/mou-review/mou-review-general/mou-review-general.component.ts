import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { MouCustObj } from 'app/shared/model/MouCustObj.Model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { RFAInfoObj } from 'app/shared/model/Approval/RFAInfoObj.Model';
import { KeyValueObj } from 'app/shared/model/KeyValueObj.Model';
import { first } from 'rxjs/operators';
import { environment } from 'environments/environment';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';

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
  MouType: string = "GENERAL";
  PlafondAmt: number;
  listApprover: any;
  listRecommendationObj: any;
  MrCustTypeCode: any;
  link: any;
  resultData: any;
  viewObj: string;
  mouCustObject: MouCustObj = new MouCustObj();
  listReason: any;
  ScoreResult: number;

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
    console.log("aa");
    if (this.WfTaskListId > 0) {
      this.claimTask();
    }
    this.viewObj = "./assets/ucviewgeneric/viewMouHeader.json";
    this.mouCustObject.MouCustId = this.MouCustId;
    this.http.post(URLConstant.GetMouCustById, this.mouCustObject).subscribe(
      (response: MouCustObj) => {
        this.resultData = response;
      }
    );

    var apvObj = { SchemeCode: 'MOUC_GEN_APV' }
    this.http.post(URLConstant.GetApprovedBy, apvObj).subscribe(
      (response) => {
        console.log(apvObj);
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
        console.log(this.MouReviewDataForm);
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
        this.listReason = response["ReturnObject"];
        this.MouReviewDataForm.patchValue({
          Reason: this.listReason[0].Key
        });
      }
    );

    this.http.post(AdInsConstant.GetMouCustScoreByMouCustId, { MouCustId: this.MouCustId}).pipe(first()).subscribe(
      (response) => {
        this.ScoreResult = response["ScoreResult"];
      }
    );
  }

  async claimTask() {
    var currentUserContext = JSON.parse(localStorage.getItem("UserAccess"));
    var wfClaimObj = { pWFTaskListID: this.WfTaskListId, pUserID: currentUserContext["UserName"] };
    console.log(wfClaimObj);
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
        this.router.navigate(["/Mou/Cust/ReviewPaging"]);
      },
      (error) => {
        console.log(error);
      }
    )
  }

  Return() {
    var mouObj = { MouCustId: this.MouCustId, WfTaskListId: this.WfTaskListId }
    this.http.post(URLConstant.ReturnMouReview, mouObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        this.router.navigate(["/Mou/Cust/ReviewPaging"]);
      })
  }

  GetCallBack(event) {
    if (event.Key == "customer") {
      var custObj = { CustNo: this.resultData['CustNo'] };
      this.http.post(URLConstant.GetCustByCustNo, custObj).subscribe(
        response => {
          // this.link = environment.FoundationR3Web + "/Customer/CustomerView/Page?CustId=" + response["CustId"]; 
          // window.open(this.link, '_blank');
          AdInsHelper.OpenCustomerViewByCustId(response["CustId"]);
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }
}
