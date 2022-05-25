import { Component, OnDestroy, OnInit } from '@angular/core';
import { UcPagingObj, WhereValueObj } from 'app/shared/model/uc-paging-obj.model';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';

@Component({
  selector: 'app-doc-signer-paging',
  templateUrl: './doc-signer-paging.component.html'
})
export class DocSignerPagingComponent implements OnInit, OnDestroy {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  link: string;
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
    var pagingJsonPath = "./assets/ucpaging/searchDocSigner.json";

    if (this.BizTemplateCode == CommonConstant.OPL) {
      pagingJsonPath = "./assets/ucpaging/opl/search-doc-signer-opl-paging.json"
    }

    this.inputPagingObj._url = pagingJsonPath;
    this.inputPagingObj.pagingJson = pagingJsonPath;
    this.inputPagingObj.addCritInput = new Array();
    this.inputPagingObj.whereValue = new Array();

    if (this.BizTemplateCode == CommonConstant.OPL) {

      let arrCrit = new Array();
      let critObj = new CriteriaObj();
      critObj.restriction = AdInsConstant.RestrictionLike;
      critObj.propName = 'WTL.ACT_CODE';
      critObj.value = "DOC_SIGN_" + this.BizTemplateCode;
      arrCrit.push(critObj);

      this.inputPagingObj.addCritInput = arrCrit;
    }
    else {
      var whereValueObj = new WhereValueObj();
      whereValueObj.property = "BizTemplateCode";
      whereValueObj.value = this.BizTemplateCode;
      this.inputPagingObj.whereValue.push(whereValueObj);
    }
  }

  getEvent(ev) {
    if (ev.Key == "prodOff") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.RowObj.ProdOfferingCode, ev.RowObj.ProdOfferingVersion);
    } else if (ev.Key == "agrmnt") {
      AdInsHelper.OpenAgrmntViewByAgrmntId(ev.RowObj.AgrmntId);
    }
  }
}
