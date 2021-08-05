import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';
import {ResMouCollForMouViewObjX} from 'app/impl/shared/model/Response/MOU/ResMouCollForMouViewObjX.model';
import {URLConstantX} from 'app/impl/shared/constant/URLConstantX';

@Component({
  selector: 'app-mou-view-addcoll-x',
  templateUrl: './mou-view-addcoll-x.component.html'
})
export class MouViewAddcollXComponent implements OnInit {
  @Input() MouCustId: number;

  listCollateralData: Array<ResMouCollForMouViewObjX>;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    const mouCustObj = { Id: this.MouCustId }
    this.http.post(URLConstantX.GetMouCustCollateralForMouViewByMouCustIdX, mouCustObj).subscribe(
      (response) => {
        this.listCollateralData = response['ReturnObject'];
      })
  }
}
