import { environment } from "environments/environment";
import { Component, OnInit } from "@angular/core";
import { AdInsConstant } from "app/shared/AdInstConstant";
import { UcPagingObj } from "app/shared/model/UcPagingObj.Model";
import { ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { AdInsHelper } from "app/shared/AdInsHelper";
import { URLConstant } from "app/shared/constant/URLConstant";
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { CommonConstant } from "../../shared/constant/CommonConstant";

@Component({
  selector: "app-inquiry-paging",
  templateUrl: "./app-inquiry-paging.component.html"
})
export class AppInquiryPagingComponent implements OnInit {
  inputPagingObj: UcPagingObj;
  link: string;
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
    if (this.BizTemplateCode == CommonConstant.OPL) {
      this.inputPagingObj._url = "./assets/ucpaging/searchAppInquiryOpl.json";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/searchAppInquiryOpl.json";
      this.inputPagingObj.ddlEnvironments = [
        {
          name: "A.ORI_OFFICE_CODE",
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
    else {
      this.inputPagingObj._url = "./assets/ucpaging/searchAppInquiry.json";
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
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;

    this.inputPagingObj.addCritInput = new Array();

    var critLobObj = new CriteriaObj();
    critLobObj.restriction = AdInsConstant.RestrictionEq;
    critLobObj.propName = 'A.BIZ_TEMPLATE_CODE';
    critLobObj.value = this.BizTemplateCode;
    this.inputPagingObj.addCritInput.push(critLobObj);

    this.isReady = true;
  }

  getEvent(event) {
    if(event.Key == "customer"){
      var custObj = { CustNo: event.RowObj.custNo };
      this.http.post(URLConstant.GetCustByCustNo, custObj).subscribe(
        response => {
          AdInsHelper.OpenCustomerViewByCustId(response["CustId"]);
        }
      );
    }
    else if(event.Key == "product"){
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(event.RowObj.prodOfferingCode,event.RowObj.prodOfferingVersion); 
    }
    else if(event.Key == "agreement"){
      AdInsHelper.OpenAgrmntViewByAgrmntId(event.RowObj.AgrmntId);
    }
    else if(event.Key == "application"){
      AdInsHelper.OpenAppViewByAppId(event.RowObj.AppId);
    }
  }
}
