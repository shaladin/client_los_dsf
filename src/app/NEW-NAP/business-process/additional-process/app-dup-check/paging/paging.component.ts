import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { Router, ActivatedRoute } from '@angular/router';
import { ClaimWorkflowObj } from 'app/shared/model/Workflow/ClaimWorkflowObj.Model';
import { HttpClient } from '@angular/common/http';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';


@Component({
  selector: 'app-paging',
  templateUrl: './paging.component.html',
  styleUrls: []
})
export class PagingComponent implements OnInit {

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
    this.inputPagingObj._url = "./assets/ucpaging/searchAppDupCheck.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchAppDupCheck.json";

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

    // var currentUserContext = JSON.parse(localStorage.getItem("UserAccess"));
    // var addCrit = new CriteriaObj();
    // addCrit.DataType = 'text';
    // addCrit.propName = 'WTL.USERNAME';
    // addCrit.restriction = AdInsConstant.RestrictionIn;
    // var arrayString = new Array<string>();
    // arrayString.push(currentUserContext["UserName"]);
    // arrayString.push("");
    // addCrit.listValue = arrayString;

    // this.inputPagingObj.addCritInput.push(addCrit);
  }

  NextScreen(event) {
    // var currentUserContext = JSON.parse(localStorage.getItem("UserAccess"));
    // var wfClaimObj = new ClaimWorkflowObj();
    // wfClaimObj.pWFTaskListID = event.RowObj.WfTaskListId;
    // wfClaimObj.pUserID = currentUserContext["UserName"];

    // this.http.post(AdInsConstant.ClaimTask, wfClaimObj).subscribe(
    //   (response) => {

    //   });
    if(event.Key == "ViewProdOffering"){ 
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion( event.RowObj.ProdOfferingCode, event.RowObj.ProdOfferingVersion);  
      return false;
    }

    if (event.RowObj.CustTypeCode == CommonConstant.CustTypePersonal && event.RowObj.IsExistingCust == false) {
      this.router.navigate(["/Nap/AdditionalProcess/AppDupCheck/Personal"], { queryParams: { "AppId": event.RowObj.AppId, "WfTaskListId": event.RowObj.WfTaskListId } });
    }
    if (event.RowObj.CustTypeCode == CommonConstant.CustTypePersonal && event.RowObj.IsExistingCust == true) {
      this.router.navigate(["/Nap/AdditionalProcess/AppDupCheck/ApplicantExistingData/Personal"], { queryParams: { "AppId": event.RowObj.AppId, "WfTaskListId": event.RowObj.WfTaskListId } });
    }
    if (event.RowObj.CustTypeCode == CommonConstant.CustTypeCompany && event.RowObj.IsExistingCust == false) {
      this.router.navigate(["/Nap/AdditionalProcess/AppDupCheck/Company"], { queryParams: { "AppId": event.RowObj.AppId, "WfTaskListId": event.RowObj.WfTaskListId } });
    }
    if (event.RowObj.CustTypeCode == CommonConstant.CustTypeCompany && event.RowObj.IsExistingCust == true) {
      this.router.navigate(["/Nap/AdditionalProcess/AppDupCheck/ApplicantExistingData/Company"], { queryParams: { "AppId": event.RowObj.AppId, "WfTaskListId": event.RowObj.WfTaskListId } });
    }
  }
}
