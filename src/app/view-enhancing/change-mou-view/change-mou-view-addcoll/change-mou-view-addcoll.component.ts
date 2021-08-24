import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ResMouCollForMouViewObj } from 'app/shared/model/Response/MOU/ResMouCollForMouViewObj.model';


@Component({
  selector: 'app-change-mou-view-addcoll',
  templateUrl: './change-mou-view-addcoll.component.html'
})
export class ChangeMouViewAddcollComponent implements OnInit {
  @Input() ChangeMouTrxId: number;

  listCollateralData: Array<ResMouCollForMouViewObj> = new Array();

  constructor(private http: HttpClient) { }

  ngOnInit() {
      this.http.post(URLConstant.GetChangeMouCustCollateralForChangeMouViewByMouCustId, { Id: this.ChangeMouTrxId}).subscribe(
        (responseCMCC) => {
          console.log(responseCMCC);
          this.listCollateralData = responseCMCC['ReturnObject'];
        })
  }

  ChangeMouCustCollateralId: number = 0;
  isView:boolean = false;
  ViewColl(ChangeMouCustCollateralId: number){
    console.log(ChangeMouCustCollateralId);

    this.isView = false;
    setTimeout(() => {      
      this.ChangeMouCustCollateralId = ChangeMouCustCollateralId;
      this.isView = true;
    }, 500);
  }

  Back() {
    this.isView = false;
  }
}
