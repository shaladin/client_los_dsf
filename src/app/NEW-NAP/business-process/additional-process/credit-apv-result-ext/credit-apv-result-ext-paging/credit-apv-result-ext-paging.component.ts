import { Component, OnInit, ComponentFactoryResolver, ViewChild, ViewContainerRef, OnDestroy } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { UcpagingComponent } from '@adins/ucpaging';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { UcPagingObj } from 'app/shared/model/uc-paging-obj.model';

@Component({
  selector: 'app-credit-apv-result-ext-paging',
  templateUrl: './credit-apv-result-ext-paging.component.html'
})
export class CreditApvResultExtPagingComponent implements OnInit, OnDestroy {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  link: string;
  BizTemplateCode: string;
  ExtendBasedOn = "APP";
  isReady: boolean = false;
  navigationSubscription;

  constructor(private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private router: Router, private componentFactoryResolver: ComponentFactoryResolver) { 
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
    this.ChangeExtendBasedOn(this.ExtendBasedOn);
  }

  getEvent(ev){
    if(ev.Key == "prodOff"){
      let GetProduct : GenericObj = new GenericObj();
      GetProduct.Code = ev.RowObj.ProdOfferingCode;
      this.http.post<GenericObj>(URLConstant.GetProdOfferingHByCode, GetProduct).subscribe(
        response => {
          AdInsHelper.OpenProdOfferingViewByProdOfferingHId(response.Id);
        });
    }else if(ev.Key == "suppl"){
      this.http.post(URLConstant.GetVendorByVendorCode, {Code : ev.RowObj.SupplCode}).subscribe(
        response => {
          AdInsHelper.OpenVendorBranchViewByVendorId(response['VendorId']);
        });
    }else if(ev.Key == "agrmnt"){
      AdInsHelper.OpenAgrmntViewByAgrmntId(ev.RowObj.AgrmntId);
    }
  }

  ExtendBasedOnChanged(event){
    this.isReady = false;
    this.ChangeExtendBasedOn(event.target.value);
    setTimeout (() => {
      this.isReady = true
    }, 10);
  }

  ChangeExtendBasedOn(extendBasedOn){
    this.ExtendBasedOn = extendBasedOn;
    if (extendBasedOn == "APP")
    {
      this.inputPagingObj._url = "./assets/ucpaging/searchCrdApvResExtensionForApp.json";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/searchCrdApvResExtensionForApp.json";
      this.inputPagingObj.addCritInput = new Array();
        
      var critObj = new CriteriaObj();
      critObj.DataType = 'text';
      critObj.propName = 'A.BIZ_TEMPLATE_CODE';
      critObj.restriction = AdInsConstant.RestrictionEq;
      critObj.value = this.BizTemplateCode;
      this.inputPagingObj.addCritInput.push(critObj);

      let addCrit: CriteriaObj = new CriteriaObj();
      addCrit.DataType = "text";
      addCrit.propName = "A.APP_CURR_STEP";
      addCrit.restriction = AdInsConstant.RestrictionIn;
      addCrit.listValue = ['AGR'];
      this.inputPagingObj.addCritInput.push(addCrit);
    }
    else if (extendBasedOn == "AGR")
    {
      this.inputPagingObj._url = "./assets/ucpaging/searchCrdApvResExtension.json";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/searchCrdApvResExtension.json";
      this.inputPagingObj.addCritInput = new Array();
        
      var critObj = new CriteriaObj();
      critObj.DataType = 'text';
      critObj.propName = 'A.BIZ_TEMPLATE_CODE';
      critObj.restriction = AdInsConstant.RestrictionEq;
      critObj.value = this.BizTemplateCode;
      this.inputPagingObj.addCritInput.push(critObj);

      let addCrit: CriteriaObj = new CriteriaObj();
      addCrit.DataType = "text";
      addCrit.propName = "AG.AGRMNT_CURR_STEP";
      addCrit.restriction = AdInsConstant.RestrictionIn;
      addCrit.listValue = ['OFVA', 'PO'];
      this.inputPagingObj.addCritInput.push(addCrit);
    }
  }
}
