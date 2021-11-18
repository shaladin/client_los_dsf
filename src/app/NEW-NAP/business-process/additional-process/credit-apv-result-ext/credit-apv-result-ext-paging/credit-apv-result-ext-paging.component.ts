import { Component, OnInit, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { Router, ActivatedRoute } from '@angular/router';
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
export class CreditApvResultExtPagingComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  link: string;
  BizTemplateCode: string;
  ExtendBasedOn = "APP";
  @ViewChild("PagingModal", { read: ViewContainerRef }) pagingModal: ViewContainerRef;

  constructor(private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private router: Router, private componentFactoryResolver: ComponentFactoryResolver) { 
    this.route.queryParams.subscribe(params => {
      if (params["BizTemplateCode"] != null) {
        this.BizTemplateCode = params["BizTemplateCode"];
      }
  });
  }
  
  ngOnInit() {
    this.ChangeExtendBasedOn("APP");
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
    this.ChangeExtendBasedOn(event.target.value);
  }

  ChangeExtendBasedOn(extendBasedOn){
    if (extendBasedOn == "APP")
    {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(UcpagingComponent);
      this.pagingModal.clear();
      const component = this.pagingModal.createComponent(componentFactory);

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

      component.instance.searchObj = this.inputPagingObj;
      component.instance.callback.subscribe((e) => this.getEvent(e));
    }
    else if (extendBasedOn == "AGR")
    {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(UcpagingComponent);
      this.pagingModal.clear();
      const component = this.pagingModal.createComponent(componentFactory);

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
      
      component.instance.searchObj = this.inputPagingObj;
      component.instance.callback.subscribe((e) => this.getEvent(e));
    }
  }
}
