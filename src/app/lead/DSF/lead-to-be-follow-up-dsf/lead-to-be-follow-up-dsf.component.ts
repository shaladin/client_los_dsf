import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { URLConstantDsf } from 'app/shared/constant/URLConstantDsf';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';

@Component({
  selector: 'app-lead-to-be-follow-up-dsf',
  templateUrl: './lead-to-be-follow-up-dsf.component.html',
  styleUrls: ['./lead-to-be-follow-up-dsf.component.css']
})
export class LeadToBeFollowUpDsfComponent implements OnInit {

  ReqByIdObj: GenericObj = new GenericObj();
  inputPagingObj: UcPagingObj = new UcPagingObj();
  CustId: string;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.inputPagingObj._url = "./assets/ucpaging/searchNewLeadToBeFollowUp.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchNewLeadToBeFollowUp.json";
  }

  GetCallBack(ev: any) {
    if (ev.Key == "Edit") {
      var reqObj = { TrxNo: ev.RowObj.LeadNo };
      this.http.post(URLConstantDsf.UpdateNotify, reqObj).subscribe(
        (response) => {
        
        }
      )

      this.ReqByIdObj.CustNo = ev.RowObj.CustNo;
      this.http.post(URLConstant.GetCustByCustNo, this.ReqByIdObj).subscribe(
        response => {
          this.CustId = response["CustId"];
        }
      );

      if (ev.RowObj.CustType == "PERSONAL")
      {
      AdInsHelper.EditCustomerMainDataPersonalByCustId(this.CustId, "EditMainData");
      // AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_CF4W_NAP1], { "AppId": ev.RowObj.AppId, "WfTaskListId": ev.RowObj.WfTaskListId });
      }
      else
      {
        AdInsHelper.EditCustomerMainDataCompanyByCustId(this.CustId, "EditMainData");
      }
    }
  }

}
