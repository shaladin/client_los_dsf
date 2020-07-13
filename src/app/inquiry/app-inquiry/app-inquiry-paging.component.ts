import { environment } from "environments/environment";
import { Component, OnInit, ViewChild } from "@angular/core";
import { AdInsConstant } from "app/shared/AdInstConstant";
import { UcPagingObj } from "app/shared/model/UcPagingObj.Model";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { AdInsHelper } from "app/shared/AdInsHelper";
import { URLConstant } from "app/shared/constant/URLConstant";
import { CommonConstant } from "app/shared/constant/CommonConstant";

@Component({
  selector: "app-inquiry-paging",
  templateUrl: "./app-inquiry-paging.component.html"
})
export class AppInquiryPagingComponent implements OnInit {
  inputPagingObj: UcPagingObj;
  link: string;
  token: any = localStorage.getItem(CommonConstant.TOKEN);

  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit() {
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/searchAppInquiry.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;
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
      },
      {
        name: "B.AGRMNT_STAT",
        environment: environment.FoundationR3Url
      }
    ];
  }

  getEvent(event) {
    // console.log("productlink")
    // console.log(event)

    if (event.Key == "customer") {
      var custObj = { CustNo: event.RowObj.custNo };
      this.http.post(URLConstant.GetCustByCustNo, custObj).subscribe(
        response => {
          this.link = environment.FoundationR3Web + "/Customer/CustomerView/Page?CustId=" + response["CustId"];
          window.open(this.link, '_blank');
        },
        (error) => {
          console.log(error);
        }
      );
    }
    else if (event.Key == "product") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(event.RowObj.prodOfferingCode, event.RowObj.prodOfferingVersion, this.token);
    }
    else if (event.Key == "agreement") {
      window.open(environment.losR3Web + "/Nap/View/AgrmntView?AgrmntId=" + event.RowObj.AgrmntId, "_blank");
    }
    else if (event.Key == "application") {
      //TEMUAN STEVEN : OPEN APPLICATION DIGANTI PAKE HELPER SUPAYA NANTI GANTINYA GAK DIBANYAK TITIK
      AdInsHelper.OpenAppViewByAppId(event.RowObj.AppId);
      //window.open( environment.losR3Web + "/Nap/View/AppView?AppId=" + event.RowObj.AppId, "_blank");
    }
    else if (event.Key == "product") {
      window.open(environment.FoundationR3Web + "/Product/OfferingView?prodOfferingHId=" + 0 + "&prodOfferingCode=" + event.RowObj.prodOfferingCode + "&prodOfferingVersion=" + event.RowObj.prodOfferingVersion, "_blank");
    }
  }
}
