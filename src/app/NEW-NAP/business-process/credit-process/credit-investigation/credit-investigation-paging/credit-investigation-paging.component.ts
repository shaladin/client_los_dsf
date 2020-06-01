import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-credit-investigation-paging',
  templateUrl: './credit-investigation-paging.component.html'
})
export class CreditInvestigationPagingComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  BizTemplateCode: string;
  arrCrit: Array<any> = new Array();
  
  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      if (params["BizTemplateCode"] != null) {
        this.BizTemplateCode = params["BizTemplateCode"];
        localStorage.setItem("BizTemplateCode", this.BizTemplateCode);
      }
    });
  }
  
  ngOnInit() {
    this.inputPagingObj._url = "./assets/ucpaging/searchCreditInvestigation.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchCreditInvestigation.json";
    this.inputPagingObj.addCritInput = new Array();

    var critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionEq;
    critObj.propName = 'A.APP_CURR_STEP';
    critObj.value = "CINV";
    this.arrCrit.push(critObj);

    var critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionLike;
    critObj.propName = 'WTL.ACT_CODE';
    critObj.value = "CRD_INV_"+this.BizTemplateCode;
    this.inputPagingObj.addCritInput.push(critObj);
    
  }
}
