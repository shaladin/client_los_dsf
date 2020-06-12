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
    this.inputPagingObj.addCritInput = this.ActAndOfficeCriteria();
  }

  ActAndOfficeCriteria() : Array<CriteriaObj>{
    var critObjs : Array<CriteriaObj> = new Array<CriteriaObj>();

    var critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionLike;
    critObj.propName = 'WTL.ACT_CODE';
    critObj.value = "EDIT_APP_" + this.BizTemplateCode;
    critObjs.push(critObj);
    
    critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionIn;
    if(this.userAccess.MrOfficeTypeCode!=AdInsConstant.CENTER_GROUP_CODE){
      critObj.propName = 'a.ORI_OFFICE_CODE';
      critObj.listValue = [this.userAccess.OfficeCode];
    }else{
      critObj.propName = 'a.ORI_OFFICE_CODE';
      var obj = { CenterGrpCode: AdInsConstant.CENTER_GROUP_CODE };
      this.http.post(AdInsConstant.GetListCenterGrpMemberByCenterGrpCode, obj).subscribe(
        (response) => {
          var CenterGrpOfficeMbrObjs : Array<CenterGrpOfficeMbrObj> = response["ListCenterGrpOfficeMbr"];

          var listDataTemp = new Array();
          for(var i=0;i<CenterGrpOfficeMbrObjs.length;i++){
            listDataTemp.push(CenterGrpOfficeMbrObjs[i].RefOfficeCode);
          } 
          critObj.listValue = listDataTemp;
        },
        (error) => {
          console.log(error);
        }
      )
    }
    critObjs.push(critObj);

    return critObjs;
  }

  GetCallback(ev){
    if(this.BizTemplateCode == AdInsConstant.CF4W){
      this.router.navigate(["Nap/ConsumerFinance/Add/Detail"], { queryParams: { "AppId": ev.RowObj.AppId, "WfTaskListId": ev.RowObj.WfTaskListId, "ReturnHandlingHId": ev.RowObj.ReturnHandlingHId } });
    }
    if(this.BizTemplateCode == AdInsConstant.FL4W){
      this.router.navigate(["Nap/FinanceLeasing/Add/Detail"], { queryParams: { "AppId": ev.RowObj.AppId, "WfTaskListId": ev.RowObj.WfTaskListId, "ReturnHandlingHId": ev.RowObj.ReturnHandlingHId } });
    }
    if(this.BizTemplateCode == AdInsConstant.CFRFN4W){
      this.router.navigate(["Nap/CFRefinancing/Add/Detail"], { queryParams: { "AppId": ev.RowObj.AppId, "WfTaskListId": ev.RowObj.WfTaskListId, "ReturnHandlingHId": ev.RowObj.ReturnHandlingHId } });
    }
  }

}
