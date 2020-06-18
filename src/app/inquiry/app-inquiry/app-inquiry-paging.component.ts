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
  token : any = localStorage.getItem("Token");

  constructor(private router:Router, private http:HttpClient) { }

  ngOnInit() {
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/searchAppInquiry.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchAppInquiry.json";

    this.inputPagingObj.ddlEnvironments = [
      {
        name: "A.ORI_OFFICE_CODE",
        environment: environment.FoundationR3Url
      },
      {
        name: "A.APP_STAT",
        environment: environment.FoundationR3Url
      },
      {
        name: "ISNULL(B.AGRMNT_CURR_STEP,A.APP_CURR_STEP)",
        environment: environment.FoundationR3Url
      }
    ];
  }

  getEvent(event){
    // console.log("productlink")
    // console.log(event)
    if(event.Key == "Customer"){
      var custObj = { CustNo: event.RowObj.custNo };
      this.http.post(AdInsConstant.GetCustByCustNo, custObj).subscribe(
        response => {
          this.link = environment.FoundationR3Web + "/Customer/CustomerView/Page?CustId=" + response["CustId"];
          this.router.navigate([]).then(result => { window.open(this.link, '_blank'); });
        },
        (error) => {
          console.log(error);
        }
      );
    }

    if(event.Key == "Product"){
      var link = environment.FoundationR3Web + "/Product/OfferingView?prodOfferingHId=0&prodOfferingCode=" + event.RowObj.prodOfferingCode + "&prodOfferingVersion=" + event.RowObj.prodOfferingVersion + "&Token=" + this.token;
      this.router.navigate([]).then(result => { window.open(link, '_blank'); });
    }
  }
}
