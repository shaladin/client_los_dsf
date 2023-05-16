import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { UcPagingObj } from 'app/shared/model/uc-paging-obj.model';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';

@Component({
  selector: 'app-insurance-order-paging-x',
  templateUrl: './insurance-order-paging-x.component.html'
})
export class InsuranceOrderPagingXComponent implements OnInit, OnDestroy {

  inputPagingObj: UcPagingObj = new UcPagingObj();
  BizTemplateCode: string;
  navigationSubscription;
  isReady:boolean = false;

  constructor(
    private route: ActivatedRoute, 
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

  ngOnInit() {    
    this.SetUcPaging();
  }
  
  ngOnDestroy(){
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  RefetchData(){    
    this.isReady = false;
    this.SubscribeParam();
    this.SetUcPaging();
    setTimeout (() => {
      this.isReady = true
    }, 10);    
  }

  SetUcPaging(){
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/impl/ucpaging/searchInsuranceOrderX.json";
    this.inputPagingObj.pagingJson = "./assets/impl/ucpaging/searchInsuranceOrderX.json";
    this.inputPagingObj.addCritInput = new Array();

    var critBizTemplate = new CriteriaObj();
    critBizTemplate.restriction = AdInsConstant.RestrictionEq;
    critBizTemplate.propName = 'AG.BIZ_TEMPLATE_CODE';
    critBizTemplate.value = this.BizTemplateCode;    
    this.inputPagingObj.addCritInput.push(critBizTemplate);    
  }

  SubscribeParam(){
    this.route.queryParams.subscribe(params => {
      if (params["BizTemplateCode"] != null) {
        this.BizTemplateCode = params["BizTemplateCode"];
        localStorage.setItem("BizTemplateCode",this.BizTemplateCode);
      }
      else{
        this.BizTemplateCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);
      }
    });
  }

  GetCallBack(ev) {
    if (ev.Key == "ViewAgrmnt") {
      AdInsHelper.OpenAgrmntViewByAgrmntId(ev.RowObj.AgrmntId);
    }
  }

}
