import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';

@Component({
  selector: 'app-mou-view-approval-recommendation',
  templateUrl: './mou-view-approval-recommendation.component.html'
})
export class MouViewApprovalRecommendationComponent implements OnInit {
  @Input() MouCustNo: string;
  ReqByTrxNo: GenericObj = new GenericObj();
  listRecommendationObj: any = "";
  listRecommendationIsReady: boolean = false;

  MouReviewDataForm = this.fb.group({
    ApvRecommendation: this.fb.array([])
  })
  constructor(private fb: FormBuilder, private http: HttpClient) { }

  async ngOnInit() {
    this.ReqByTrxNo.TrxNo = this.MouCustNo;
    // var listRec = this.MouReviewDataForm.get("ApvRecommendation") as FormArray;
    await this.http.post(URLConstant.GetAdtQuestionByTrxNo, this.ReqByTrxNo).toPromise().then(
      (response) => {
        this.listRecommendationObj = response["ReturnObject"];
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
      this.listRecommendationIsReady = true;
      console.log("INIII");
      console.log(this.listRecommendationObj);
  }

}
