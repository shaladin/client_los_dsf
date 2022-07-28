import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { CookieService } from "ngx-cookie";
import { UcPagingObj } from 'app/shared/model/uc-paging-obj.model';
import { CurrentUserContext } from 'app/shared/model/current-user-context.model';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { UcpagingComponent } from '@adins/ucpaging';

@Component({
  selector: 'app-change-mou-inquiry-x',
  templateUrl: './change-mou-inquiry-x.component.html',
  styleUrls: []
})
export class ChangeMouInquiryXComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  user: CurrentUserContext;
  MouType = "";
  MouObj: Array<KeyValueObj> = new Array();
  @ViewChild("PagingModal", { read: ViewContainerRef }) pagingModal: ViewContainerRef;

  constructor( private http: HttpClient, private cookieService: CookieService,private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit(): void {
    this.user = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

      // this.inputPagingObj = new UcPagingObj();
      // this.inputPagingObj._url = "./assets/ucpaging/mou/searchChangeMouInquiry.json";
      // this.inputPagingObj.pagingJson = "./assets/ucpaging/mou/searchChangeMouInquiry.json";
      this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeMouType }).subscribe(
        (response) => {
           this.MouObj = response[CommonConstant.ReturnObj];
           if (this.MouObj.length > 0) {
             this.MouType = this.MouObj[0].Key;
             this.ChangeMouType(this.MouType);
           }
         }
       );

  }
  // getEvent(event){
  //   let custId: number;
  //   let mrCustTypeCode: string;
  //   if (event.Key == "customer") {
  //    let CustNoObj = { CustNo : event.RowObj.CustNo };
  //     this.http.post(URLConstant.GetCustByCustNo, CustNoObj).subscribe(
  //       (response) => {
  //         custId = response['CustId'];
  //         mrCustTypeCode = response['MrCustTypeCode'];

  //         if(mrCustTypeCode == CommonConstant.CustTypeCompany){
  //           AdInsHelper.OpenCustomerCoyViewByCustId(custId);
  //         }
          
  //         if(mrCustTypeCode == CommonConstant.CustTypePersonal){
  //           AdInsHelper.OpenCustomerViewByCustId(custId);
  //         }
  //       });
  //   }
  // }

  getEvent(ev: any) {
    if (ev.Key == "customer") {
      var custObj = { CustNo: ev.RowObj["CustNo"] };
    } else if (ev.Key == "vendor") {
      var custObj = { CustNo: ev.RowObj["VendorCustNo"] };
    }
    this.http.post(URLConstant.GetCustByCustNo, custObj).subscribe(
      response => {
        if (response["MrCustTypeCode"] == CommonConstant.CustTypePersonal) {
          AdInsHelper.OpenCustomerViewByCustId(response["CustId"]);
        }
        if (response["MrCustTypeCode"] == CommonConstant.CustTypeCompany) {
          AdInsHelper.OpenCustomerCoyViewByCustId(response["CustId"]);
        }
      }
    );
  }

  MouTypeChanged(event) {
    this.ChangeMouType(event.target.value);
  }

  ChangeMouType(mouType) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(UcpagingComponent);
    this.pagingModal.clear();
    const component = this.pagingModal.createComponent(componentFactory);
    this.inputPagingObj.addCritInput = new Array();
    var critObj = new CriteriaObj();
    critObj.DataType = 'text';
    critObj.propName = 'MC.MR_MOU_TYPE_CODE';
    critObj.restriction = AdInsConstant.RestrictionEq;

    this.inputPagingObj.ddlEnvironments = [
      {
        name: "MC.MR_MOU_TYPE_CODE",
        environment: environment.FoundationR3Url + "/v1",
      },
    ];
    if (mouType == CommonConstant.FACTORING) {
      this.inputPagingObj._url = "./assets/impl/ucpaging/mou/searchChangeMouInquiryFactoringX.json";
      this.inputPagingObj.pagingJson = "./assets/impl/ucpaging/mou/searchChangeMouInquiryFactoringX.json";
      critObj.value = CommonConstant.FACTORING;

    }
    else if (mouType == CommonConstant.GENERAL) {
      this.inputPagingObj._url = "./assets/impl/ucpaging/mou/searchChangeMouInquiryX.json";
      this.inputPagingObj.pagingJson = "./assets/impl/ucpaging/mou/searchChangeMouInquiryX.json";
      critObj.value = CommonConstant.GENERAL;
    }
    else if (mouType == CommonConstant.DEALERFINANCING) {
      this.inputPagingObj._url = "./assets/impl/ucpaging/mou/searchChangeMouInquiryX.json";
      this.inputPagingObj.pagingJson = "./assets/impl/ucpaging/mou/searchChangeMouInquiryX.json";
      critObj.value = CommonConstant.DEALERFINANCING;
    }
    
    this.inputPagingObj.addCritInput.push(critObj);
    component.instance.searchObj = this.inputPagingObj;
    component.instance.callback.subscribe((e) => this.getEvent(e));
  }
}
