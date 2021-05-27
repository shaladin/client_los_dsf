import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-edit-app-after-approval-paging',
  templateUrl: './edit-app-after-approval-paging.component.html',
  styleUrls: ['./edit-app-after-approval-paging.component.css']
})
export class EditAppAfterApprovalPagingComponent implements OnInit {
  inputPagingObj: UcPagingObj;
  BizTemplateCode: string;
  constructor(
    private route: ActivatedRoute,
    private router: Router) {
    this.route.queryParams.subscribe(params => {
      if (params["BizTemplateCode"] != null) {
        this.BizTemplateCode = params["BizTemplateCode"];
        localStorage.setItem("BizTemplateCode", this.BizTemplateCode);
      }
    });
  }

  ngOnInit() {
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/searchEditAppAfterApproval.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchEditAppAfterApproval.json";
    this.inputPagingObj.ddlEnvironments = [
      {
        name: "A.ORI_OFFICE_CODE",
        environment: environment.FoundationR3Url
      }
    ];
    var arrAddCrit = new Array();
    var addCrit = new CriteriaObj();
    addCrit.DataType = "text";
    addCrit.propName = "APP.BIZ_TEMPLATE_CODE";
    addCrit.restriction = AdInsConstant.RestrictionEq;
    addCrit.value = this.BizTemplateCode;
    arrAddCrit.push(addCrit);
    this.inputPagingObj.addCritInput = arrAddCrit;
  }

  GetCallBack(ev: any) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion( ev.RowObj.ProdOfferingCode, ev.RowObj.ProdOfferingVersion);  
    }
  }
}
