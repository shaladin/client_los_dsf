import { environment } from "environments/environment";
import { Component, OnInit, ViewChild } from "@angular/core";
import { AdInsConstant } from "app/shared/AdInstConstant";
import { UcPagingObj } from "app/shared/model/UcPagingObj.Model";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-inquiry-paging",
  templateUrl: "./app-inquiry-paging.component.html"
})
export class AppInquiryPagingComponent implements OnInit {
  inputPagingObj: UcPagingObj;
  link: string;

  constructor(private router:Router, private http:HttpClient) { }

  ngOnInit() {
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/searchAppInquiry.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchAppInquiry.json";
  }

  getEvent(event){
    if(event.Key == "Customer"){
        this.http.post(AdInsConstant.GetCustByCustNo, {CustNo: event.RowObj.CustNo}).subscribe(
          response => {
            this.link = environment.FoundationR3Web + "/Customer/CustomerView/Page?CustId=" + response["CustId"];
            this.router.navigate([]).then(result => { window.open(this.link, '_blank'); });
          },
          (error) => {
            console.log(error);
          }
        );
    }
  }
}
