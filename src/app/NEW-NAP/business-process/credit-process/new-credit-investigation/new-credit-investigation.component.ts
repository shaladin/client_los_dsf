import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { ActivatedRoute, Router } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { environment } from 'environments/environment';
import { CommonConstant } from 'app/shared/constant/CommonConstant';

@Component({
  selector: 'app-new-credit-investigation',
  templateUrl: './new-credit-investigation.component.html'
})
export class NewCreditInvestigationComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  BizTemplateCode: string;
  arrCrit: Array<any> = new Array();

  constructor(private route: ActivatedRoute, private router: Router) {
    this.route.queryParams.subscribe(params => {
      if (params["BizTemplateCode"] != null) {
        this.BizTemplateCode = params["BizTemplateCode"];
        localStorage.setItem("BizTemplateCode", this.BizTemplateCode);
      }
      else {
        this.BizTemplateCode = CommonConstant.CFNA;
      }
    });
  }

  ngOnInit() {
    this.inputPagingObj._url = "./assets/ucpaging/searchNewCreditInvestigation.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchNewCreditInvestigation.json";
    this.inputPagingObj.addCritInput = new Array();

    this.inputPagingObj.ddlEnvironments = [
      {
        name: "A.ORI_OFFICE_CODE",
        environment: environment.FoundationR3Url
      }
    ];

    var critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionEq;
    critObj.propName = 'A.APP_CURR_STEP';
    critObj.value = "CINV";
    this.arrCrit.push(critObj);

    var critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionLike;
    critObj.propName = 'WTL.ACT_CODE';
    critObj.value = "CRD_INV_" + this.BizTemplateCode;
    this.inputPagingObj.addCritInput.push(critObj);
  }

  Callback(event) {
    if (event.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(event.RowObj.ProdOfferingCode, event.RowObj.ProdOfferingVersion);
    }
  }
}
