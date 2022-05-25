import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { UcPagingObj } from 'app/shared/model/uc-paging-obj.model';
import { environment } from 'environments/environment';
import { HttpClient } from "@angular/common/http";
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { AdInsHelperService } from 'app/shared/services/AdInsHelper.service';

@Component({
  selector: 'app-edit-app-after-approval-paging',
  templateUrl: './edit-app-after-approval-paging.component.html',
  styleUrls: ['./edit-app-after-approval-paging.component.css']
})
export class EditAppAfterApprovalPagingComponent implements OnInit, OnDestroy {
  inputPagingObj: UcPagingObj;
  BizTemplateCode: string;
  CustNoObj: GenericObj = new GenericObj();
  isReady: boolean = false;
  navigationSubscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private adInsHelperService: AdInsHelperService) {
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
    this.inputPagingObj._url = "./assets/ucpaging/searchEditAppAfterApproval.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchEditAppAfterApproval.json";
    var arrAddCrit = new Array();
    var addCrit = new CriteriaObj();
    addCrit.DataType = "text";
    addCrit.propName = "APP.BIZ_TEMPLATE_CODE";
    addCrit.restriction = AdInsConstant.RestrictionEq;
    addCrit.value = this.BizTemplateCode;
    arrAddCrit.push(addCrit);
    this.inputPagingObj.addCritInput = arrAddCrit;
  }

  GetCallBack(ev) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion( ev.RowObj.ProdOfferingCode, ev.RowObj.ProdOfferingVersion);  
    }else if (ev.Key == "ViewCustomer"){
      this.CustNoObj.CustNo = ev.RowObj.CustNo;
      this.http.post(URLConstant.GetCustByCustNo, this.CustNoObj).subscribe(
        (response) => {
          if(response["MrCustTypeCode"] == CommonConstant.CustTypePersonal){
            this.adInsHelperService.OpenCustomerViewByCustId(response["CustId"]);
          }
          if(response["MrCustTypeCode"] == CommonConstant.CustTypeCompany){
            this.adInsHelperService.OpenCustomerCoyViewByCustId(response["CustId"]);
          }
        });
    }
  }
}
