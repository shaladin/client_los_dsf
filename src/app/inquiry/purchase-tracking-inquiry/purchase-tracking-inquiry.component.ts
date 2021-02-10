import { environment } from "environments/environment";
import { Component, OnInit } from "@angular/core";
import { AdInsConstant } from "app/shared/AdInstConstant";
import { UcPagingObj } from "app/shared/model/UcPagingObj.Model";
import { ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { AdInsHelper } from "app/shared/AdInsHelper";
import { URLConstant } from "app/shared/constant/URLConstant";
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';

@Component({
  selector: 'app-purchase-tracking-inquiry',
  templateUrl: './purchase-tracking-inquiry.component.html',
  styleUrls: []
})
export class PurchaseTrackingInquiryComponent implements OnInit {
  inputPagingObj: UcPagingObj;
  BizTemplateCode: string;
  isReady: boolean = false;

  constructor(private http: HttpClient,
    private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      if (params["BizTemplateCode"] != null) {
        this.BizTemplateCode = params["BizTemplateCode"];
        localStorage.setItem("BizTemplateCode", this.BizTemplateCode);
      }
    });
  }

  ngOnInit() {
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/searchPurchaseTrackingInquiry.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchPurchaseTrackingInquiry.json";
    this.inputPagingObj.ddlEnvironments = [
      {
        name: "A.ORI_OFFICE_CODE",
        environment: environment.FoundationR3Url
      }
    ];

    this.inputPagingObj.addCritInput = new Array();
    var critLobObj = new CriteriaObj();
    critLobObj.restriction = AdInsConstant.RestrictionEq;
    critLobObj.propName = 'A.BIZ_TEMPLATE_CODE';
    critLobObj.value = this.BizTemplateCode;
    this.inputPagingObj.addCritInput.push(critLobObj);

    this.isReady = true;
  }

  getEvent(event) {
    if(event.Key == "Application") {
      AdInsHelper.OpenAppViewByAppId(event.RowObj.AppId);
    }
    else if(event.Key == "Agreement") {
      AdInsHelper.OpenAgrmntViewByAgrmntId(event.RowObj.AgrmntId);
    }
    else if(event.Key == "Customer") {
      var custObj = { CustNo: event.RowObj.CustNo };
      this.http.post(URLConstant.GetCustByCustNo, custObj).subscribe(
        response => {
          AdInsHelper.OpenCustomerViewByCustId(response["CustId"]);
        }
      );
    }
    else if(event.Key == "AppAsset") {
      
    }
    else if(event.Key == "View") {
      window.open(environment.losR3Web + "/View/PurchaseTracking?AppId=" + event.RowObj.AppId, "_blank");
    }
  }
}