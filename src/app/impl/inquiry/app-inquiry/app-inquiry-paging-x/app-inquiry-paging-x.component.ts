import { Component, OnInit } from "@angular/core";
import { AdInsConstant } from "app/shared/AdInstConstant";
import { ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { AdInsHelper } from "app/shared/AdInsHelper";
import { URLConstant } from "app/shared/constant/URLConstant";
import { CommonConstant } from "app/shared/constant/CommonConstant";
import { UcPagingObj } from "app/shared/model/uc-paging-obj.model";
import { GenericObj } from "app/shared/model/generic/generic-obj.model";
import { CriteriaObj } from "app/shared/model/criteria-obj.model";

@Component({
  selector: 'app-app-inquiry-paging-x',
  templateUrl: './app-inquiry-paging-x.component.html',
  styleUrls: ['./app-inquiry-paging-x.component.css']
})
export class AppInquiryPagingXComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  CustNoObj: GenericObj = new GenericObj();
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
    if (this.BizTemplateCode == CommonConstant.OPL) {
      this.inputPagingObj._url = "./assets/ucpaging/searchAppInquiryOpl.json";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/searchAppInquiryOpl.json";
    }
    else if(this.BizTemplateCode == CommonConstant.FCTR){
      this.inputPagingObj._url = "./assets/impl/ucpaging/searchAppInquiryFactoring.json";
      this.inputPagingObj.pagingJson = "./assets/impl/ucpaging/searchAppInquiryFactoring.json";
    }
    else {
      this.inputPagingObj._url = "./assets/ucpaging/searchAppInquiry.json";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/searchAppInquiry.json";
    }

    this.inputPagingObj.addCritInput = new Array();

    var critLobObj = new CriteriaObj();
    critLobObj.restriction = AdInsConstant.RestrictionEq;
    critLobObj.propName = 'A.BIZ_TEMPLATE_CODE';
    critLobObj.value = this.BizTemplateCode;
    this.inputPagingObj.addCritInput.push(critLobObj);

    this.isReady = true;
  }

  getEvent(event: any) {
    if(event.Key == "customer"){
      this.CustNoObj.CustNo = event.RowObj.custNo;      
      this.http.post(URLConstant.GetCustByCustNo, this.CustNoObj).subscribe(
        response => {
          if(response["MrCustTypeCode"] == CommonConstant.CustTypePersonal){
            AdInsHelper.OpenCustomerViewByCustId(response["CustId"]);
          }
          if(response["MrCustTypeCode"] == CommonConstant.CustTypeCompany){
            AdInsHelper.OpenCustomerCoyViewByCustId(response["CustId"]);
          }
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

