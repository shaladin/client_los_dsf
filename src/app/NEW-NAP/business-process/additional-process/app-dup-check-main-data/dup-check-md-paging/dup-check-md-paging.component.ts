import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { Router, ActivatedRoute } from '@angular/router';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';

@Component({
  selector: 'app-dup-check-md-paging',
  templateUrl: './dup-check-md-paging.component.html',
  styleUrls: []
})
export class DupCheckMdPagingComponent implements OnInit {

  inputPagingObj: any;
  arrCrit: any;
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
    this.inputPagingObj._url = "./assets/ucpaging/searchAppDupCheckMainData.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchAppDupCheckMainData.json";

    this.inputPagingObj.ddlEnvironments = [
      {
        name: "a.ORI_OFFICE_CODE",
        environment: environment.FoundationR3Url
      }
    ];

    var critLobObj = new CriteriaObj();
    critLobObj.restriction = AdInsConstant.RestrictionLike;
    critLobObj.DataType = 'text';
    critLobObj.propName = 'RL.BIZ_TMPLT_CODE';
    critLobObj.value = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);
    this.inputPagingObj.addCritInput.push(critLobObj);
  }

  NextScreen(event) {
    if(event.Key == "ViewProdOffering"){ 
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion( event.RowObj.ProdOfferingCode, event.RowObj.ProdOfferingVersion);  
      return false;
    }

    /*
    if (event.RowObj.CustTypeCode == CommonConstant.CustTypePersonal && event.RowObj.IsExistingCust == false) {
      this.router.navigate(["/Nap/AdditionalProcess/AppDupCheckMainData/Personal"], { queryParams: { "AppId": event.RowObj.AppId, "WfTaskListId": event.RowObj.WfTaskListId } });
    }
    */
    AdInsHelper.RedirectUrl(this.router,["/Nap/AdditionalProcess/AppDupCheckMainData/SubjList"], { "AppId": event.RowObj.AppId, "WfTaskListId": event.RowObj.WfTaskListId });
  }
}
