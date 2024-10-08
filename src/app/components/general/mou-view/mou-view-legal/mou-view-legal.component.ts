import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ResMouCustLglReviewObj } from 'app/shared/model/response/mou/mou-cust/res-mou-cust-lgl-review-obj.model';

@Component({
  selector: 'app-mou-view-legal',
  templateUrl: './mou-view-legal.component.html',
  providers: [NGXToastrService]
})
export class MouViewLegalComponent implements OnInit {
  @Input() MouCustId: number;

  listLglReviewData: Array<ResMouCustLglReviewObj> = new Array<ResMouCustLglReviewObj>();

  constructor(private http: HttpClient) { }

  ngOnInit() {
    var mouCustObj = { Id: this.MouCustId }
    this.http.post(URLConstant.GetMouCustLglReviewByMouCustId, mouCustObj).subscribe(
      (response) => {
        this.listLglReviewData = response['ReturnObject'];
      })
  }
}
