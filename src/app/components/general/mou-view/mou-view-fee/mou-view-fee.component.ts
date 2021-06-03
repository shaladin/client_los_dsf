import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ResMouCustFeeObj } from 'app/shared/model/Response/MOU/MouCust/ResMouCustFeeObj.model';

@Component({
  selector: 'app-mou-view-fee',
  templateUrl: './mou-view-fee.component.html'
})
export class MouViewFeeComponent implements OnInit {
  @Input() MouCustId: number;

  listFeeData: Array<ResMouCustFeeObj> = new Array<ResMouCustFeeObj>();

  constructor(private http: HttpClient) { }

  ngOnInit() {
    var mouCustObj = { Id: this.MouCustId }
    this.http.post(URLConstant.GetMouCustFeeByMouCustId, mouCustObj).subscribe(
      (response: Array<ResMouCustFeeObj>) => {
        this.listFeeData = response;
      })
  }
}
