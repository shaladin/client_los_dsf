import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { HttpClient } from '@angular/common/http';
import { CenterGrpOfficeMbrObj } from 'app/shared/model/RefOffice/CenterGrpOfficeMbrObj.Model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-return-handling-edit-app-paging',
  templateUrl: './return-handling-edit-app-paging.component.html',
  styleUrls: []
})
export class ReturnHandlingEditAppPagingComponent implements OnInit {

  BizTemplateCode: string;
  token: any = localStorage.getItem("Token");
  constructor(
    private http: HttpClient,
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
    this.userAccess = JSON.parse(localStorage.getItem("UserAccess"));

    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/searchReturnHandlingApp.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchReturnHandlingApp.json";
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
    console.log(ev);
    if (ev.Key == "Edit") {
      if (this.BizTemplateCode == AdInsConstant.CF4W) {
        this.router.navigate(["Nap/ConsumerFinance/Add/Detail"], { queryParams: { "AppId": ev.RowObj.AppId, "WfTaskListId": ev.RowObj.WfTaskListId, "ReturnHandlingHId": ev.RowObj.ReturnHandlingHId } });
      }
      if (this.BizTemplateCode == AdInsConstant.FL4W) {
        this.router.navigate(["Nap/FinanceLeasing/Add/Detail"], { queryParams: { "AppId": ev.RowObj.AppId, "WfTaskListId": ev.RowObj.WfTaskListId, "ReturnHandlingHId": ev.RowObj.ReturnHandlingHId } });
      }
      if (this.BizTemplateCode == AdInsConstant.CFRFN4W) {
        this.router.navigate(["Nap/CFRefinancing/Add/Detail"], { queryParams: { "AppId": ev.RowObj.AppId, "WfTaskListId": ev.RowObj.WfTaskListId, "ReturnHandlingHId": ev.RowObj.ReturnHandlingHId } });
      }
    }
    if (ev.Key == "ViewProdOffering") {
      var link = environment.FoundationR3Web + "/Product/OfferingView?prodOfferingHId=0&prodOfferingCode=" + ev.RowObj.prodOfferingCode + "&prodOfferingVersion=" + ev.RowObj.prodOfferingVersion + "&Token=" + this.token;
      this.router.navigate([]).then(result => { window.open(link, '_blank'); });
    }
  }

}
