import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { MouCustObj } from 'app/shared/model/MouCustObj.Model';
import { environment } from 'environments/environment';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ReqByCustNoObj } from 'app/shared/model/Request/ReqByCustNoObj.model';

@Component({
  selector: 'app-mou-view-listed-cust-factoring',
  templateUrl: './mou-view-listed-cust-factoring.component.html'
})
export class MouViewListedCustFactoringComponent implements OnInit {
  responseCustListed: Array<any>;
  CustNoObj: ReqByCustNoObj = new ReqByCustNoObj();
  @Input() MouCustId : number;
  constructor(private http : HttpClient) { } 

  ngOnInit() {
    var mouObj = new MouCustObj();
    mouObj.MouCustId = this.MouCustId;
    this.http.post(URLConstant.GetListMouCustListedCustFctrByMouCustId, { Id: this.MouCustId }).subscribe(
      response => {
        this.responseCustListed = response['mouCustListedCustFctrObjs'];
      });
  }
  openView(custNo){
    this.CustNoObj.CustNo = custNo;
    this.http.post(URLConstant.GetCustByCustNo, this.CustNoObj).subscribe(
      response => {
        AdInsHelper.OpenCustomerViewByCustId(response["CustId"]);
      });
  }
}
