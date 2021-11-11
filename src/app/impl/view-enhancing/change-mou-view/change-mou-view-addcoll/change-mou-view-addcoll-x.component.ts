import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {URLConstantX} from 'app/impl/shared/constant/URLConstantX';
import {ResMouCollForMouViewObjX} from '../../../shared/model/Response/MOU/ResMouCollForMouViewObjX.model';


@Component({
  selector: 'app-change-mou-view-addcoll-x',
  templateUrl: './change-mou-view-addcoll-x.component.html'
})
export class ChangeMouViewAddcollXComponent implements OnInit {
  @Input() ChangeMouTrxId: number;

  listCollateralData:  Array<ResMouCollForMouViewObjX> = new Array();

  constructor(private http: HttpClient) { }

  ngOnInit() {
      this.http.post(URLConstantX.GetChangeMouCustCollateralXForChangeMouViewByMouCustId, { Id: this.ChangeMouTrxId}).subscribe(
        (response) => {
          this.listCollateralData = response['ReturnObject'];
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
