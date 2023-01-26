import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {URLConstantX} from 'app/impl/shared/constant/URLConstantX';
import {ResMouCollForMouViewObjX} from '../../../shared/model/Response/MOU/ResMouCollForMouViewObjX.model';
import { URLConstant } from 'app/shared/constant/URLConstant';


@Component({
  selector: 'app-change-mou-view-addcoll-history-ver-x',
  templateUrl: './change-mou-view-addcoll-history-ver-x.component.html'
})
export class ChangeMouViewAddcollHistoryVerXComponent implements OnInit {
  @Input() MouCustId: number;

  listCollateralData:  Array<ResMouCollForMouViewObjX> = new Array();

  constructor(private http: HttpClient) { }

  ngOnInit() {
    var mouCustObj = { Id: this.MouCustId }
    this.http.post(URLConstant.GetMouCustCollateralForMouViewByMouCustId, mouCustObj).subscribe(
      (response) => {
        this.listCollateralData = response['ReturnObject'];
      });
  }

  MouCustCollateralId: number = 0;
  isView:boolean = false;
  ViewColl(MouCustCollateralId: number){

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
