import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ResMouCollForMouViewObj } from 'app/shared/model/response/mou/res-mou-coll-for-mou-view-obj.model';

@Component({
  selector: 'app-mou-tab-view-addcoll-x',
  templateUrl: './mou-tab-view-addcoll-x.component.html'
})
export class MouTabViewAddcollXComponent implements OnInit {
  @Input() MouCustId: number;

  listCollateralData: Array<ResMouCollForMouViewObj> = new Array();

  constructor(private http: HttpClient) { }

  ngOnInit() {
    var mouCustObj = { Id: this.MouCustId }
    this.http.post(URLConstant.GetMouCustCollateralForMouViewByMouCustId, mouCustObj).subscribe(
      (response) => {
        this.listCollateralData = response['ReturnObject'];
      })
  }

  MouCustCollateralId: number = 0;
  isView: boolean = false;
  async ViewColl(MouCustCollateralId: number) {
    this.isView = false;
    setTimeout(() => {      
      this.MouCustCollateralId = MouCustCollateralId;
      this.isView = true;
    }, 500);
  }

  Back() {
    this.isView = false;
  }
}
