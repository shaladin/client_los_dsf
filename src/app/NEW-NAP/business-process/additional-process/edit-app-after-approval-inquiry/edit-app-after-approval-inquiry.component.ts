import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { UcPagingObj } from 'app/shared/model/uc-paging-obj.model';
import { AdInsHelperService } from 'app/shared/services/AdInsHelper.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-edit-app-after-approval-inquiry',
  templateUrl: './edit-app-after-approval-inquiry.component.html',
  styleUrls: ['./edit-app-after-approval-inquiry.component.css']
})
export class EditAppAfterApprovalInquiryComponent implements OnInit, OnDestroy {
  inputPagingObj: UcPagingObj;
  BizTemplateCode: string;
  isReady: boolean = false;
  navigationSubscription;

  constructor(
    private http: HttpClient, 
    private route: ActivatedRoute,
    private adInsHelperService: AdInsHelperService,
    private router: Router
    ) {
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
          localStorage.setItem("BizTemplateCode", this.BizTemplateCode);
        }
      });
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
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/searchEditAppAfterApprovalInquiry.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchEditAppAfterApprovalInquiry.json";

    this.inputPagingObj.addCritInput = new Array();

    var critLobObj = new CriteriaObj();
    critLobObj.restriction = AdInsConstant.RestrictionEq;
    critLobObj.propName = 'A.BIZ_TEMPLATE_CODE';
    critLobObj.value = this.BizTemplateCode;
    this.inputPagingObj.addCritInput.push(critLobObj);
  }

  getEvent(event) {
    if(event.Key == "customer"){
      let CustNoObj = { CustNo: event.RowObj.CustNo };
      this.http.post(URLConstant.GetCustByCustNo, CustNoObj).subscribe(
        (response) => {
          if(response["MrCustTypeCode"] == CommonConstant.CustTypePersonal){
            this.adInsHelperService.OpenCustomerViewByCustId(response["CustId"]);
          }
          if(response["MrCustTypeCode"] == CommonConstant.CustTypeCompany){
            this.adInsHelperService.OpenCustomerCoyViewByCustId(response["CustId"]);
          }
        });
    }
    else if(event.Key == "editAppAftApvTrx"){
      AdInsHelper.OpenEditAppAfterApv(event.RowObj.EditAppAftApvTrxHId, event.RowObj.AgrmntId); 
    }
    else if(event.Key == "agreement"){
      AdInsHelper.OpenAgrmntViewByAgrmntId(event.RowObj.AgrmntId);
    }
    else if(event.Key == "application"){
      AdInsHelper.OpenAppViewByAppId(event.RowObj.AppId);
    }
  }
}
