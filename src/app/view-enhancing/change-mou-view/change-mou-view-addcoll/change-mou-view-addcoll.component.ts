import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';


@Component({
  selector: 'app-change-mou-view-addcoll',
  templateUrl: './change-mou-view-addcoll.component.html'
})
export class ChangeMouViewAddcollComponent implements OnInit {
  @Input() ChangeMouTrxId: number;

  listCollateralData: any;

  constructor(private http: HttpClient) { }

  ngOnInit() {
      this.http.post(URLConstant.GetChangeMouCustCollateralForChangeMouViewByMouCustId, { Id: this.ChangeMouTrxId}).subscribe(
        (responseCMCC) => {
          this.listCollateralData = responseCMCC['ReturnObject'];
        })
  }
}
