import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { MouCustObj } from 'app/shared/model/MouCustObj.Model';
import { environment } from 'environments/environment';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-mou-view-listed-cust-factoring',
  templateUrl: './mou-view-listed-cust-factoring.component.html'
})
export class MouViewListedCustFactoringComponent implements OnInit {
  responseCustListed: Array<any>;
  @Input() MouCustId : number;
  constructor(private http : HttpClient) { } 

  ngOnInit() {
    let mouObj = new MouCustObj();
    mouObj.MouCustId = this.MouCustId;
    this.http.post<Array<any>>(URLConstant.GetListMouCustListedCustFctrByMouCustId, mouObj).subscribe(
      response => {
        this.responseCustListed = response;
      });
  }
  openView(custNo){
    var link: string;
    var custObj = { CustNo: custNo };
    this.http.post(URLConstant.GetCustByCustNo, custObj).subscribe(
      response => {
        AdInsHelper.OpenCustomerViewByCustId(response["CustId"]);
      });
  }
}
