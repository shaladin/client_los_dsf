import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';

@Component({
  selector: 'app-doc-checklist-paging',
  templateUrl: './doc-checklist-paging.component.html'
})
export class DocChecklistPagingComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  bizTemplateCode: string;

  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      if (params["BizTemplateCode"] != null) {
        this.bizTemplateCode = params["BizTemplateCode"];
        localStorage.setItem("BizTemplateCode", this.bizTemplateCode);
      }
      else {
        this.bizTemplateCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);
      }
    });
  }



  ngOnInit() {
    this.inputPagingObj._url = "./assets/ucpaging/searchDocChecklist.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchDocChecklist.json";
    this.inputPagingObj.ddlEnvironments = [
      {
        name: "app.ORI_OFFICE_CODE",
        environment: environment.FoundationR3Url
      }
    ];
    var critInput = new CriteriaObj();
    critInput.propName = "wFht.ACT_CODE";
    critInput.restriction = AdInsConstant.RestrictionEq;
    critInput.value = "DCK_DEC_" + this.bizTemplateCode;
    this.inputPagingObj.addCritInput.push(critInput);
  }

  GetCallBack(ev: any) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.RowObj.ProdOfferingCode, ev.RowObj.ProdOfferingVersion);
    }
  }
}
