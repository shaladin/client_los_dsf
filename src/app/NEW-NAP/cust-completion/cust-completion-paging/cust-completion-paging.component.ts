import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';

@Component({
  selector: 'app-cust-completion-paging',
  templateUrl: './cust-completion-paging.component.html',
  styleUrls: ['./cust-completion-paging.component.scss']
})
export class CustCompletionPagingComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  bizTemplateCode: string;
  
  constructor(private route: ActivatedRoute, private router: Router) {
    this.route.queryParams.subscribe(params => {
      if (params['BizTemplateCode'] != null) {
        this.bizTemplateCode = params['BizTemplateCode'];
      }
    });
  }

  ngOnInit() {
    this.inputPagingObj._url = "./assets/ucpaging/searchCustCompletion.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchCustCompletion.json";
    this.inputPagingObj.addCritInput = new Array();

    var critLobObj = new CriteriaObj();
    critLobObj.restriction = AdInsConstant.RestrictionEq;
    critLobObj.propName = 'A.BIZ_TEMPLATE_CODE';
    critLobObj.value = this.bizTemplateCode;
    this.inputPagingObj.addCritInput.push(critLobObj);

    var critWorflowAct = new CriteriaObj();
    critWorflowAct.restriction = AdInsConstant.RestrictionEq;
    critWorflowAct.propName = 'WTL.ACT_CODE';
    critWorflowAct.value = "CDA";
    this.inputPagingObj.addCritInput.push(critWorflowAct);
  }

  getUcPagingCallBack(ev: any) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.RowObj.prodOfferingCode, ev.RowObj.prodOfferingVersion);
    }
    if (ev.Key == "Edit") {
      AdInsHelper.RedirectUrl(this.router,[NavigationConstant.NAP_CUST_COMPL_DETAIL], { "AppId": ev.RowObj.AppId, "WfTaskListId": ev.RowObj.WfTaskListId, "BizTemplateCode": ev.RowObj.BizTemplateCode});
    }
  }
}
