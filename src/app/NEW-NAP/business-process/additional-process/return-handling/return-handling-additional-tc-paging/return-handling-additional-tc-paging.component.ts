import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'environments/environment';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';

@Component({
  selector: 'app-return-handling-additional-tc-paging',
  templateUrl: './return-handling-additional-tc-paging.component.html',
  styleUrls: []
})
export class ReturnHandlingAdditionalTcPagingComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  BizTemplateCode: string;

  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      if (params["BizTemplateCode"] != null) {
        this.BizTemplateCode = params["BizTemplateCode"];
        localStorage.setItem("BizTemplateCode", this.BizTemplateCode);
      }
    });
  }

  ngOnInit() {
    this.inputPagingObj._url = "./assets/ucpaging/searchReturnHandlingAdditionalTc.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchReturnHandlingAdditionalTc.json";
    this.inputPagingObj.ddlEnvironments = [
      {
        name: "a.ORI_OFFICE_CODE",
        environment: environment.FoundationR3Url
      }
    ];
    this.inputPagingObj.addCritInput = this.ActAndOfficeCriteria();
  }

  ActAndOfficeCriteria(): Array<CriteriaObj> {
    var critObjs: Array<CriteriaObj> = new Array<CriteriaObj>();

    var critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionLike;
    critObj.propName = 'WTL.ACT_CODE';
    critObj.value = "ADD_TC_" + this.BizTemplateCode;
    critObjs.push(critObj);

    return critObjs;
  }

  GetCallBack(ev) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.RowObj.ProdOfferingCode, ev.RowObj.ProdOfferingVersion);
    }
  }
}
