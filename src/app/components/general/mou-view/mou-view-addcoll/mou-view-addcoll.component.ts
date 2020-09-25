import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-mou-view-addcoll',
  templateUrl: './mou-view-addcoll.component.html'
})
export class MouViewAddcollComponent implements OnInit {
  @Input() MouCustId: number;

  listCollateralData: any;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    var mouCustObj = { MouCustId: this.MouCustId }
    this.http.post(URLConstant.GetMouCustCollateralForMouViewByMouCustId, mouCustObj).subscribe(
      (response) => {
        this.listCollateralData = response['ReturnObject'];
      })
  }
}
