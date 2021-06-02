import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mou-execution-paging',
  templateUrl: './mou-execution-paging.component.html',
  styleUrls: ['./mou-execution-paging.component.scss']
})
export class MouExecutionPagingComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.inputPagingObj._url = "./assets/ucpaging/mou/searchMouRequestForExec.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/mou/searchMouRequestForExec.json";
    this.inputPagingObj.ddlEnvironments = [
      {
        name: "MOU.MR_MOU_TYPE_CODE",
        environment: environment.FoundationR3Url
      }
    ];
  }

  getEvent(event) {
    console.log(event)
    if (event.Key == "exe") {
      var obj = {
        MouCustId: event.RowObj.MouCustId,
        MouCustNo: event.RowObj.MouCustNo
      }
      this.http.post(URLConstant.CheckMouActiveR2, obj).subscribe(
        response => {
          AdInsHelper.RedirectUrl(this.router, ["/Mou/Execution/Detail"], { "MouCustId": event.RowObj.MouCustId, "WfTaskListId": event.RowObj.WfTaskListId });
        }
      );
    } else if (event.Key == "customer") {
      var custNo = event.RowObj.CustNo;
      var custObj = { CustNo: custNo };
      var custId: number
      this.http.post(URLConstant.GetCustByCustNo, custObj).subscribe(
        (response) => {
          custId = response['CustId'];
          AdInsHelper.OpenCustomerViewByCustId(custId);
        });
    }
  }
}
