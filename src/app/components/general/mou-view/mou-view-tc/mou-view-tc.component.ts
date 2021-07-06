import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ResMouCustTCObj } from 'app/shared/model/Response/MOU/MouCust/ResMouCustTCObj.model';
import { GenericListObj } from 'app/shared/model/Generic/GenericListObj.Model';

@Component({
  selector: 'app-mou-view-tc',
  templateUrl: './mou-view-tc.component.html'
})
export class MouViewTcComponent implements OnInit {
  @Input() MouCustId: number;

  listTCData: Array<ResMouCustTCObj> = new Array<ResMouCustTCObj>();
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.GetListActiveRefTc();
    var mouCustObj = { Id: this.MouCustId }
    this.http.post(URLConstant.GetCustMouTcByCustMouId, mouCustObj).subscribe(
      (response) => {
        this.listTCData = response['ReturnObject'];
      })
  }

  dictRefTc: { [id: string]: string } = {};
  GetListActiveRefTc() {
    this.http.post(URLConstant.GetListActiveRefTc, null).subscribe(
      (response: GenericListObj) => {
        for (let index = 0; index < response.ReturnObject.length; index++) {
          const element = response.ReturnObject[index];
          this.dictRefTc[element.TcCode] = element.TcName;
        }
      }
    );
  }
}
