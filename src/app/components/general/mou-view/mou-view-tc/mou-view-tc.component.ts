import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ResMouCustTCObj } from 'app/shared/model/Response/MOU/MouCust/ResMouCustTCObj.model';

@Component({
  selector: 'app-mou-view-tc',
  templateUrl: './mou-view-tc.component.html'
})
export class MouViewTcComponent implements OnInit {
  @Input() MouCustId: number;

  listTCData: Array<ResMouCustTCObj> = new Array<ResMouCustTCObj>();
  constructor(private http: HttpClient) { }

  ngOnInit() {
    var mouCustObj = { Id: this.MouCustId }
    this.http.post(URLConstant.GetCustMouTcByCustMouId, mouCustObj).subscribe(
      (response) => {
        this.listTCData = response['ReturnObject'];
      })
  }
}
