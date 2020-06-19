import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-customer-doc-printing-paging',
  templateUrl: './customer-doc-printing-paging.component.html',
})
export class CustomerDocPrintingPagingComponent implements OnInit {
  inputPagingObj: UcPagingObj;
  user:any;

  constructor(private router: Router, private http: HttpClient) { }
  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem("UserAccess"));

    if (this.user.MrOfficeTypeCode != "HO") {
      this.router.navigate(["/Mou/UnauthorizedPage"]);
      return;
    }
    else
    {
      this.inputPagingObj = new UcPagingObj();
      this.inputPagingObj._url = "./assets/ucpaging/searchCustomerDocPrinting.json";
      this.inputPagingObj.enviromentUrl = environment.losUrl;
      this.inputPagingObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;
      this.inputPagingObj.pagingJson = "./assets/ucpaging/searchCustomerDocPrinting.json";
  
      this.inputPagingObj.ddlEnvironments = [
        {
          name: "MC.MR_MOU_TYPE_CODE",
          environment: environment.FoundationR3Url
        }
      ];
    }
  }

  getEvent(event){
    if(event.Key == "customer"){
        var link : string;
        var custObj = { CustNo: event.RowObj.CustNo };
        this.http.post(AdInsConstant.GetCustByCustNo, custObj).subscribe(
          response => {
            link = environment.FoundationR3Web + "/Customer/CustomerView/Page?CustId=" + response["CustId"];
            window.open(link, '_blank');
          },
          (error) => {
            console.log(error);
          }
        );
    }
  }
}
