import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { MouCustObj } from 'app/shared/model/MouCustObj.Model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { RFAInfoObj } from 'app/shared/model/Approval/RFAInfoObj.Model';
import { KeyValueObj } from 'app/shared/model/KeyValueObj.Model';

@Component({
  selector: 'app-mou-review-factoring',
  templateUrl: './mou-review-factoring.component.html',
  providers: [NGXToastrService]
})
export class MouReviewFactoringComponent implements OnInit {
  rfaInfoObj: RFAInfoObj = new RFAInfoObj();
  mouCustObj: MouCustObj = new MouCustObj();
  keyValueObj: KeyValueObj;
  MouCustId : any;
  WfTaskListId: any;
  MouType : string = "FACTORING";
  PlafondAmt: any;
  listApprover: any;

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

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService) {
    this.route.queryParams.subscribe(params => {
      this.MouCustId = params["MouCustId"];
      this.WfTaskListId = params["WfTaskListId"];
    })
  }

  ngOnInit() {
    this.claimTask();

    var apvObj = { SchemeCode: 'MOUC_FCTR_APV' }
    this.http.post(AdInsConstant.GetApprovedBy, apvObj).subscribe(
      (response) => {
        console.log(apvObj);
        this.listApprover = response;

        this.MouReviewDataForm.patchValue({
          ListApprover: this.listApprover[0].Key,
          Reason: this.listReason[0].Key
        })
      })

    var mouCustObj = { MouCustId: this.MouCustId };
    this.http.post(AdInsConstant.GetMouCustById, mouCustObj).subscribe(
      (response) => {
        this.PlafondAmt = response['PlafondAmt'];
      })
  }

  MouReviewDataForm = this.fb.group({
    ListApprover: [''],
    Reason: [''],
    Notes: [''],
    LatarBelakang: [''],
    FaktorMendukung: [''],
    FaktorTidakMendukung: [''],
    Syarat: [''],
    Dispensasi: [''],
    SWOT: [''],
    SixC: ['']
  })

  claimTask()
  {
    var currentUserContext = JSON.parse(localStorage.getItem("UserContext"));
    var wfClaimObj = { pWFTaskListID: this.WfTaskListId, pUserID: currentUserContext["UserName"]};
    console.log(wfClaimObj);
    this.http.post(AdInsConstant.ClaimTask, wfClaimObj).subscribe(
      (response) => {
      });
  }

  Submit() {
    this.mouCustObj.MouCustId = this.MouCustId;
    this.PlafondAmt = this.PlafondAmt;

    this.rfaInfoObj.ApprovedById = this.MouReviewDataForm.controls.ListApprover.value;
    this.rfaInfoObj.Reason = this.MouReviewDataForm.controls.Reason.value;
    this.rfaInfoObj.Notes = this.MouReviewDataForm.controls.Notes.value;

    if (this.MouReviewDataForm.controls.LatarBelakang.value != null || this.MouReviewDataForm.controls.LatarBelakang.value != undefined)
    {  
      this.keyValueObj = new KeyValueObj()
      this.keyValueObj.Key = "LatarBelakang",
      this.keyValueObj.Value = this.MouReviewDataForm.controls.LatarBelakang.value
      this.rfaInfoObj.RecommendationObj.push(this.keyValueObj);
    }

    if (this.MouReviewDataForm.controls.FaktorMendukung.value != null || this.MouReviewDataForm.controls.FaktorMendukung.value != undefined)
    {  
      this.keyValueObj = new KeyValueObj()
      this.keyValueObj.Key = "FaktorMendukung",
      this.keyValueObj.Value = this.MouReviewDataForm.controls.FaktorMendukung.value
      this.rfaInfoObj.RecommendationObj.push(this.keyValueObj);
    }

    if (this.MouReviewDataForm.controls.FaktorTidakMendukung.value != null || this.MouReviewDataForm.controls.FaktorTidakMendukung.value != undefined)
    {  
      this.keyValueObj = new KeyValueObj()
      this.keyValueObj.Key = "FaktorTidakMendukung",
      this.keyValueObj.Value = this.MouReviewDataForm.controls.FaktorTidakMendukung.value
      this.rfaInfoObj.RecommendationObj.push(this.keyValueObj);
    }

    if (this.MouReviewDataForm.controls.Syarat.value != null || this.MouReviewDataForm.controls.Syarat.value != undefined)
    {  
      this.keyValueObj = new KeyValueObj()
      this.keyValueObj.Key = "Syarat",
      this.keyValueObj.Value = this.MouReviewDataForm.controls.Syarat.value
      this.rfaInfoObj.RecommendationObj.push(this.keyValueObj);
    }

    if (this.MouReviewDataForm.controls.Dispensasi.value != null || this.MouReviewDataForm.controls.Dispensasi.value != undefined)
    {  
      this.keyValueObj = new KeyValueObj()
      this.keyValueObj.Key = "Dispensasi",
      this.keyValueObj.Value = this.MouReviewDataForm.controls.Dispensasi.value
      this.rfaInfoObj.RecommendationObj.push(this.keyValueObj);
    }

    if (this.MouReviewDataForm.controls.SWOT.value != null || this.MouReviewDataForm.controls.SWOT.value != undefined)
    {  
      this.keyValueObj = new KeyValueObj()
      this.keyValueObj.Key = "SWOT",
      this.keyValueObj.Value = this.MouReviewDataForm.controls.SWOT.value
      this.rfaInfoObj.RecommendationObj.push(this.keyValueObj);
    }

    if (this.MouReviewDataForm.controls.SixC.value != null || this.MouReviewDataForm.controls.SixC.value != undefined)
    {  
      this.keyValueObj = new KeyValueObj()
      this.keyValueObj.Key = "6C",
      this.keyValueObj.Value = this.MouReviewDataForm.controls.SixC.value
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
