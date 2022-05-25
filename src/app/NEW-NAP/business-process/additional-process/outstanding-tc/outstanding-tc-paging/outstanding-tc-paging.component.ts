import { Component, OnDestroy, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/uc-paging-obj.model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';

@Component({
  selector: 'app-outstanding-tc-paging',
  templateUrl: './outstanding-tc-paging.component.html'
})
export class OutstandingTcPagingComponent implements OnInit, OnDestroy {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  BizTemplateCode: string;
  isReady: boolean = false;
  navigationSubscription;

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {
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
    this.SetUcPaging()
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
    if(this.BizTemplateCode === CommonConstant.OPL) {
      this.inputPagingObj._url = "./assets/ucpaging/searchOutstandingTCopl.json";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/searchOutstandingTCopl.json"; 
    }
    else{
      this.inputPagingObj._url = "./assets/ucpaging/searchOutstandingTC.json";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/searchOutstandingTC.json"; 
    }
    this.inputPagingObj.addCritInput = new Array();

    var critObj = new CriteriaObj();
    critObj.DataType = 'text';
    critObj.propName = 'A.BIZ_TEMPLATE_CODE';
    critObj.restriction = AdInsConstant.RestrictionEq;
    critObj.value = this.BizTemplateCode;
    this.inputPagingObj.addCritInput.push(critObj);
  }

  getEvent(ev) {
    if (ev.Key == "prodOff") {
      let GetProduct = new GenericObj();
      GetProduct.Code = ev.RowObj.ProdOfferingCode;
      this.http.post<GenericObj>(URLConstant.GetProdOfferingHByCode, GetProduct).subscribe(
        response => {
          AdInsHelper.OpenProdOfferingViewByProdOfferingHId(response.Id)
        });
    } else if (ev.Key == "agrmnt") {
      AdInsHelper.OpenAgrmntViewByAgrmntId(ev.RowObj.AgrmntId);
    }
  }
}
