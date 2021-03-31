import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { ActivatedRoute } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';

@Component({
  selector: 'app-cancel-paging',
  templateUrl: './app-cancel-paging.component.html'
})
export class AppCancelPagingComponent implements OnInit {
  inputPagingObj: UcPagingObj;
  bizTemplateCode: string;
  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      if (params["BizTemplateCode"] != null) {
        this.bizTemplateCode = params["BizTemplateCode"];
        localStorage.setItem("BizTemplateCode",this.bizTemplateCode);
      }
      else{
        this.bizTemplateCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);
      }
    });
  }
  
  ngOnInit() {
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/searchAppCancel.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchAppCancel.json";
    this.inputPagingObj.ddlEnvironments = [
      {
        name: "A.ORI_OFFICE_CODE",
        environment: environment.FoundationR3Url
      }
    ];
    this.inputPagingObj.addCritInput = new Array();
    var actCrit = new Array();
    actCrit.push("NAPD_MD_" + this.bizTemplateCode);
    actCrit.push("CUST_MD_" + this.bizTemplateCode);
    actCrit.push("CDC");
    actCrit.push("RVW_" + this.bizTemplateCode);
    actCrit.push("REQU_DEC_" + this.bizTemplateCode);
    actCrit.push("AST_ALO_" + this.bizTemplateCode);


    var critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionIn;
    critObj.propName = 'WTL.ACT_CODE';
    critObj.listValue = actCrit;

    //this.inputPagingObj.addCritInput.push(critObj);

    var critBizTemplate = new CriteriaObj();
    critBizTemplate.restriction = AdInsConstant.RestrictionEq;
    critBizTemplate.propName = 'A.BIZ_TEMPLATE_CODE';
    critBizTemplate.value = this.bizTemplateCode;

    this.inputPagingObj.addCritInput.push(critBizTemplate);

    
  }
 
  
  GetCallBack(ev: any){ 
    if(ev.Key == "ViewProdOffering"){
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.RowObj.ProdOfferingCode, ev.RowObj.ProdOfferingVersion);
    } 
  }
}
