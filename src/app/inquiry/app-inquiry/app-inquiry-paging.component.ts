import { Component, OnDestroy, OnInit } from "@angular/core";
import { AdInsConstant } from "app/shared/AdInstConstant";
import { UcPagingObj } from "app/shared/model/uc-paging-obj.model";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { AdInsHelper } from "app/shared/AdInsHelper";
import { URLConstant } from "app/shared/constant/URLConstant";
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { CommonConstant } from "app/shared/constant/CommonConstant";
import { GenericObj } from "app/shared/model/generic/generic-obj.model";
import { CookieService } from "ngx-cookie";
import { AdInsHelperService } from "app/shared/services/AdInsHelper.service";

@Component({
  selector: "app-inquiry-paging",
  templateUrl: "./app-inquiry-paging.component.html"
})
export class AppInquiryPagingComponent implements OnInit, OnDestroy {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  CustNoObj: GenericObj = new GenericObj();
  BizTemplateCode: string;
  isReady: boolean = false;
  navigationSubscription;

  constructor(private http: HttpClient,
    private route: ActivatedRoute, private router: Router, private cookieService: CookieService, private adInsHelperService: AdInsHelperService) {
      this.SubscribeParam();
      this.navigationSubscription = this.router.events.subscribe((e: any) => {
        // If it is a NavigationEnd event re-initalise the component
        if (e instanceof NavigationEnd) {
          this.RefetchData();
        }
      });
  }

  SubscribeParam(){
    this.route.queryParams.subscribe(params => {
      if (params["BizTemplateCode"] != null) {
        this.BizTemplateCode = params["BizTemplateCode"];
      }});
  }

  ngOnDestroy(): void {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  ngOnInit() {
    this.SetUcPaging();
  }

  RefetchData(){
    this.isReady = false;
    this.SubscribeParam();
    this.SetUcPaging();
    setTimeout (() => {
      this.isReady = true
    }, 10);
  }

  SetUcPaging() {
    if (this.BizTemplateCode == CommonConstant.OPL) {
      this.inputPagingObj._url = "./assets/ucpaging/searchAppInquiryOpl.json";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/searchAppInquiryOpl.json";
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
  }

  getEvent(event) {
    if(event.Key == "customer"){
      this.CustNoObj.CustNo = event.RowObj.custNo;      
      this.http.post(URLConstant.GetCustByCustNo, this.CustNoObj).subscribe(
        response => {
          if(response["MrCustTypeCode"] == CommonConstant.CustTypePersonal){
            this.adInsHelperService.OpenCustomerViewByCustId(response["CustId"]);
          }
          if(response["MrCustTypeCode"] == CommonConstant.CustTypeCompany){
            this.adInsHelperService.OpenCustomerCoyViewByCustId(response["CustId"]);
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
