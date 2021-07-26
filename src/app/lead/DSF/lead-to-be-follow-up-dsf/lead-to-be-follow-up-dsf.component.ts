import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstantDsf } from 'app/shared/constant/URLConstantDsf';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';

@Component({
  selector: 'app-lead-to-be-follow-up-dsf',
  templateUrl: './lead-to-be-follow-up-dsf.component.html',
  styleUrls: ['./lead-to-be-follow-up-dsf.component.css']
})
export class LeadToBeFollowUpDsfComponent implements OnInit {

  inputPagingObj: UcPagingObj = new UcPagingObj();

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.inputPagingObj._url = "./assets/ucpaging/searchNewLeadToBeFollowUp.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchNewLeadToBeFollowUp.json";
  }

  GetCallBack(ev: any) {
    if (ev.Key == "Edit") {
      this.http.post(URLConstantDsf.UpdateNotify, { LeadNo: ev.RowObj.LeadNo }).subscribe(
        (response) => {
        
        }
      )
      if (ev.RowObj.CustType == "PERSONAL")
      {
      AdInsHelper.EditCustomerMainDataPersonalByCustId(ev.RowObj.CustId, "EditMainData");
      // AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_CF4W_NAP1], { "AppId": ev.RowObj.AppId, "WfTaskListId": ev.RowObj.WfTaskListId });
      }
      else
      {
        AdInsHelper.EditCustomerMainDataCompanyByCustId(ev.RowObj.CustId, "EditMainData");
      }
    }
  }

}
