import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MouCustObj } from 'app/shared/model/MouCustObj.Model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { AdInsHelperService } from 'app/shared/services/AdInsHelper.service';

@Component({
  selector: 'app-mou-view-listed-cust-factoring',
  templateUrl: './mou-view-listed-cust-factoring.component.html'
})
export class MouViewListedCustFactoringComponent implements OnInit {
  responseCustListed: Array<any>;
  CustNoObj: GenericObj = new GenericObj();
  @Input() MouCustId : number;
  constructor(private http : HttpClient, private adInsHelperService: AdInsHelperService) { } 

  ngOnInit() {
    let mouObj = new MouCustObj();
    mouObj.MouCustId = this.MouCustId;
    this.http.post<Array<any>>(URLConstant.GetListMouCustListedCustFctrByMouCustId, { Id: this.MouCustId }).subscribe(
      response => {
        this.responseCustListed = response[CommonConstant.ReturnObj];
      }
    );
  }

  openView(custNo){
    this.CustNoObj.CustNo = custNo;
    this.http.post(URLConstant.GetCustByCustNo, this.CustNoObj).subscribe(
      response => {
        if(response["MrCustTypeCode"] == CommonConstant.CustTypePersonal){
          this.adInsHelperService.OpenCustomerViewByCustId(response["CustId"]);
        }
        if(response["MrCustTypeCode"] == CommonConstant.CustTypeCompany){
          this.adInsHelperService.OpenCustomerCoyViewByCustId(response["CustId"]);
        }
      }
    );
  }
}