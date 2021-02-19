import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-return-handling-new-edit-app-paging',
  templateUrl: './return-handling-new-edit-app-paging.component.html'
})
export class ReturnHandlingNewEditAppPagingComponent implements OnInit {


  BizTemplateCode: string;
  constructor(
    private route: ActivatedRoute,
    private router: Router,) {
      this.route.queryParams.subscribe(params => {
        if (params["BizTemplateCode"] != null) {
          this.BizTemplateCode = params["BizTemplateCode"];
          localStorage.setItem("BizTemplateCode", this.BizTemplateCode);
        }
      });
     }
  
  inputPagingObj;
  userAccess;
  ngOnInit() {
    this.userAccess = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));

    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/searchReturnHandlingNAP2.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchReturnHandlingNAP2.json";
    this.inputPagingObj.ddlEnvironments = [
      {
        name: "a.ORI_OFFICE_CODE",
        environment: environment.FoundationR3Url
      }
    ];
    this.inputPagingObj.addCritInput = this.ActAndOfficeCriteria();
  }

  ActAndOfficeCriteria() : Array<CriteriaObj>{
    var critObjs : Array<CriteriaObj> = new Array<CriteriaObj>();

    var critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionLike;
    critObj.propName = 'WTL.ACT_CODE';
    critObj.value = "EDIT_APP_" + this.BizTemplateCode;
    critObjs.push(critObj);

    return critObjs;
  }

  GetCallback(ev) {
    if (ev.Key == "Edit") {
      if (this.BizTemplateCode == CommonConstant.CF4W) {
        AdInsHelper.RedirectUrl(this.router,["/Nap/ConsumerFinance/NAP2"], { "AppId": ev.RowObj.AppId, "WfTaskListId": ev.RowObj.WfTaskListId, "ReturnHandlingHId": ev.RowObj.ReturnHandlingHId });
        
      }
      if (this.BizTemplateCode == CommonConstant.FL4W) {
        AdInsHelper.RedirectUrl(this.router,["Nap/FinanceLeasing/NAP2"], { "AppId": ev.RowObj.AppId, "WfTaskListId": ev.RowObj.WfTaskListId, "ReturnHandlingHId": ev.RowObj.ReturnHandlingHId });
      }
      if (this.BizTemplateCode == CommonConstant.CFRFN4W) {
        AdInsHelper.RedirectUrl(this.router,["Nap/CFRefinancing/NAP2"], { "AppId": ev.RowObj.AppId, "WfTaskListId": ev.RowObj.WfTaskListId, "ReturnHandlingHId": ev.RowObj.ReturnHandlingHId });
      }
      if (this.BizTemplateCode == CommonConstant.CFNA) {
        AdInsHelper.RedirectUrl(this.router,["Nap/CFNA/NAP2"], { "AppId": ev.RowObj.AppId, "WfTaskListId": ev.RowObj.WfTaskListId, "ReturnHandlingHId": ev.RowObj.ReturnHandlingHId });
      }
    }
    if(ev.Key == "ViewProdOffering"){
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion( ev.RowObj.prodOfferingCode, ev.RowObj.prodOfferingVersion);  
    }
  }

}
