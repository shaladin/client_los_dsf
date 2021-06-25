import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-mou-view-approval-recommendation',
  templateUrl: './mou-view-approval-recommendation.component.html'
})
export class MouViewApprovalRecommendationComponent implements OnInit {
  listRecommendationObj: any;

  MouReviewDataForm = this.fb.group({
    ApvRecommendation: this.fb.array([])
  })
  constructor(private fb: FormBuilder, private http: HttpClient) { }

  ngOnInit() {
    // var listRec = this.MouReviewDataForm.get("ApvRecommendation") as FormArray;
    var apvRecommendObj = { SchemeCode: 'MOUC_GEN_APV' }
    this.http.post(URLConstant.GetRecommendations, apvRecommendObj).subscribe(
      (response) => {
        this.listRecommendationObj = response;
        // for (let i = 0; i < this.listRecommendationObj["length"]; i++) {
        //   var ApvRecommendation = this.fb.group({
        //     RefRecommendationId: this.listRecommendationObj[i].RefRecommendationId,
        //     RecommendationCode: this.listRecommendationObj[i].RecommendationCode,
        //     RecommendationName: this.listRecommendationObj[i].RecommendationName,
        //     RecommendationValue: ['', Validators.required]
        //   }) as FormGroup;
        //   // listRec.push(ApvRecommendation);
        // }
      })
      console.log("INIII");
      console.log(this.listRecommendationObj);
  }

}
