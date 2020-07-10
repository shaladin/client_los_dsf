import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-pre-go-live-paging',
  templateUrl: './pre-go-live-paging.component.html'
})
export class PreGoLivePagingComponent implements OnInit {

  inputPagingObj: any;
  bizTemplateCode: any;
  token: any = localStorage.getItem("Token");

  constructor(private route: ActivatedRoute, private router: Router) {
    this.route.queryParams.subscribe(params => {
      if (params["BizTemplateCode"] != null) {
        this.bizTemplateCode = params["BizTemplateCode"];
        localStorage.setItem("BizTemplateCode", this.bizTemplateCode);
      }
      else {
        this.bizTemplateCode = localStorage.getItem("BizTemplateCode");
      }
    });
  }



  ngOnInit() {
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/searchPreGoLive.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchPreGoLive.json";
    this.inputPagingObj.ddlEnvironments = [
      {
        name: "app.ORI_OFFICE_CODE",
        environment: environment.FoundationR3Url
      }
    ];
    var critInput = new CriteriaObj();
    critInput.propName = "wFht.ACT_CODE";
    critInput.restriction = AdInsConstant.RestrictionEq;
    critInput.value = "PGLV_" + this.bizTemplateCode;
    this.inputPagingObj.addCritInput.push(critInput);
  }

  GetCallBack(ev: any) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.RowObj.ProdOfferingCode, ev.RowObj.ProdOfferingVersion, this.token);
    }
  }
}
