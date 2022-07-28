import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { environment } from "environments/environment";
import { URLConstant } from "app/shared/constant/URLConstant";
import { UcPagingObj } from "app/shared/model/uc-paging-obj.model";
import { AdInsHelper } from "app/shared/AdInsHelper";
import { NavigationConstant } from "app/shared/constant/NavigationConstant";
import { CommonConstant } from "app/shared/constant/CommonConstant";
import { Router } from "@angular/router";
import { AdInsHelperService } from "app/shared/services/AdInsHelper.service";
import { UcpagingComponent } from "@adins/ucpaging";
import { AdInsConstant } from "app/shared/AdInstConstant";
import { CriteriaObj } from "app/shared/model/criteria-obj.model";
import { KeyValueObj } from "app/shared/model/key-value/key-value-obj.model";

@Component({
  selector: "app-change-mou-request-paging-x",
  templateUrl: "./change-mou-request-paging-x.component.html"
})

export class ChangeMouRequestPagingXComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  MouType = "";
  MouObj: Array<KeyValueObj> = new Array();
  @ViewChild("PagingModal", { read: ViewContainerRef }) pagingModal: ViewContainerRef;

  constructor(
    private http: HttpClient,
    private toastr: NGXToastrService,
    private router: Router,
    private AdInsHelperService: AdInsHelperService,
    private componentFactoryResolver: ComponentFactoryResolver
  ) { }

  ngOnInit() {
   
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

  getEvent(ev: any) {
    if (ev.Key == "edit") {
      var obj = { Id: ev.RowObj["MouCustId"] };
      this.http
        .post(URLConstant.CheckMouCustInChangeMouProcess, obj)
        .subscribe((response) => {
          if (response["Status"] == "Success") {
            this.toastr.errorMessage("MOU is in another process");
            return;
          } else {
            AdInsHelper.RedirectUrl(
              this.router,
              [
                NavigationConstant.CHANGE_MOU_REQ_DETAIL
              ],
              { MouCustId: ev.RowObj["MouCustId"] }
            );
          }
        });
    } else if (ev.Key == "ViewCust") {
      var custObj = { CustNo: ev.RowObj["CustNo"] };
    } else if (ev.Key == "ViewVendor") {
      var custObj = { CustNo: ev.RowObj["VendorCustNo"] };
    }
    this.http.post(URLConstant.GetCustByCustNo, custObj).subscribe(
      response => {
        if (response["MrCustTypeCode"] == CommonConstant.CustTypePersonal) {
          this.AdInsHelperService.OpenCustomerViewByCustId(response["CustId"]);
        }
        if (response["MrCustTypeCode"] == CommonConstant.CustTypeCompany) {
          this.AdInsHelperService.OpenCustomerCoyViewByCustId(response["CustId"]);
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
    this.inputPagingObj.ddlEnvironments = [
      {
        name: "MOU.MR_MOU_TYPE_CODE",
        environment: environment.FoundationR3Url + "/v1",
      },
    ];

    var critObj = new CriteriaObj();
    critObj.DataType = 'text';
    critObj.propName = 'MOU.MR_MOU_TYPE_CODE';
    critObj.restriction = AdInsConstant.RestrictionEq;

    if (mouType == CommonConstant.FACTORING) {
      this.inputPagingObj._url = "./assets/impl/ucpaging/mou/searchChangeMouRequestFactoringX.json";
      this.inputPagingObj.pagingJson = "./assets/impl/ucpaging/mou/searchChangeMouRequestFactoringX.json";
      critObj.value = CommonConstant.FACTORING;
    
    }
    else if (mouType == CommonConstant.GENERAL) {
      this.inputPagingObj._url = "./assets/impl/ucpaging/mou/searchChangeMouRequestX.json";
      this.inputPagingObj.pagingJson = "./assets/impl/ucpaging/mou/searchChangeMouRequestX.json";
      critObj.value = CommonConstant.GENERAL;
    }
    else if (mouType == CommonConstant.DEALERFINANCING) {
      this.inputPagingObj._url = "./assets/impl/ucpaging/mou/searchChangeMouRequestX.json";
      this.inputPagingObj.pagingJson = "./assets/impl/ucpaging/mou/searchChangeMouRequestX.json";
      critObj.value = CommonConstant.DEALERFINANCING;
   
    }

    this.inputPagingObj.addCritInput.push(critObj);
    component.instance.searchObj = this.inputPagingObj;
    component.instance.callback.subscribe((e) => this.getEvent(e));
  }
}
