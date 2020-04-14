import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { MouCustObj } from 'app/shared/model/MouCustObj.Model';
import { AdInsConstant } from 'app/shared/AdInstConstant';

@Component({
  selector: 'app-mou-review-factoring',
  templateUrl: './mou-review-factoring.component.html',
  styleUrls: ['./mou-review-factoring.component.scss'],
  providers: [NGXToastrService]
})
export class MouReviewFactoringComponent implements OnInit {
  mouCustObj: MouCustObj;
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
    Notes: ['']
  })

  Submit() {
    var mouObj = {
      MouCustId: this.MouCustId, WfTaskListId: this.WfTaskListId,
      RfaApproverId: this.MouReviewDataForm.controls.ListApprover.value,
      RfaReason: this.MouReviewDataForm.controls.Reason.value,
      RfaNotes: this.MouReviewDataForm.controls.Notes.value,
      PlafondAmt: this.PlafondAmt
    }
    this.http.post(AdInsConstant.SubmitMouReview, mouObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        this.router.navigate(["/Mou/Cust/ReviewPaging"]);
      })
  }

  Return() {
    var mouObj = { MouCustId: this.MouCustId, WfTaskListId: this.WfTaskListId }
    this.http.post(AdInsConstant.ReturnMouReview, mouObj).subscribe(
      (response) => {
      })
  }
}
