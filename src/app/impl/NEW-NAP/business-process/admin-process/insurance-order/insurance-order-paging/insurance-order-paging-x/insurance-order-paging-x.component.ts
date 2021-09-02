import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { Location} from "@angular/common";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';

@Component({
  selector: 'app-insurance-order-paging-x',
  templateUrl: './insurance-order-paging-x.component.html'
})
export class InsuranceOrderPagingXComponent implements OnInit {

  inputPagingObj: UcPagingObj = new UcPagingObj();
  bizTemplateCode: string;

  constructor(
    private route: ActivatedRoute
    ) {
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
    this.inputPagingObj._url = "./assets/impl/ucpaging/searchInsuranceOrderX.json";
    this.inputPagingObj.pagingJson = "./assets/impl/ucpaging/searchInsuranceOrderX.json";
    this.inputPagingObj.addCritInput = new Array();

    var critBizTemplate = new CriteriaObj();
    critBizTemplate.restriction = AdInsConstant.RestrictionEq;
    critBizTemplate.propName = 'AG.BIZ_TEMPLATE_CODE';
    critBizTemplate.value = this.bizTemplateCode;

    this.inputPagingObj.addCritInput.push(critBizTemplate);
  }

  GetCallBack(ev){ 
    if(ev.Key == "ViewAgrmnt"){
      AdInsHelper.OpenAgrmntViewByAgrmntId(ev.RowObj.AgrmntId);
    }    
  }

}
