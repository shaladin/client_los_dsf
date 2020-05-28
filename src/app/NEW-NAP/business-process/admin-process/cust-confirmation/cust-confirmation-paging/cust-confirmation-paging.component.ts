import { Component, OnInit } from '@angular/core';
import { UcpagingModule } from '@adins/ucpaging';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cust-confirmation-paging',
  templateUrl: './cust-confirmation-paging.component.html',
  styleUrls: ['./cust-confirmation-paging.component.scss']
})
export class CustConfirmationPagingComponent implements OnInit {

  inputPagingObj: any;
  arrCrit = [];
  bizTemplateCode :any;

  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      if (params["BizTemplateCode"] != null) {
        this.bizTemplateCode = params["BizTemplateCode"];
        localStorage.setItem("BizTemplateCode",this.bizTemplateCode);
      }
      else{
        this.bizTemplateCode = localStorage.getItem("BizTemplateCode");
      }
    });
  }

  ngOnInit() {
    this.inputPagingObj = new UcpagingModule();
    this.inputPagingObj._url = "./assets/ucpaging/searchCustConfirmation.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchCustConfirmation.json";
    
    this.arrCrit = new Array();
    var critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionLike;
    critObj.propName = 'WF.ACT_CODE';
    critObj.value = "CNFR";

    var critBizTemplate = new CriteriaObj();
    critBizTemplate.propName = "A.BIZ_TEMPLATE_CODE";
    critBizTemplate.restriction = AdInsConstant.RestrictionEq;
    critBizTemplate.value = this.bizTemplateCode;

    this.arrCrit.push(critBizTemplate);
    this.arrCrit.push(critObj);
    this.inputPagingObj.addCritInput = this.arrCrit;
  }

}
