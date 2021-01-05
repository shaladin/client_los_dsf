import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { ActivatedRoute, Router } from '@angular/router';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { CenterGrpOfficeMbrObj } from 'app/shared/model/RefOffice/CenterGrpOfficeMbrObj.Model';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';

@Component({
  selector: 'app-return-handling-survey',
  templateUrl: './return-handling-survey.component.html',
  styleUrls: []
})
export class ReturnHandlingSurveyComponent implements OnInit {

  BizTemplateCode: string;

  constructor(private route: ActivatedRoute,private router: Router,private http: HttpClient) {
    this.route.queryParams.subscribe(params => {
      if (params["BizTemplateCode"] != null) {
        this.BizTemplateCode = params["BizTemplateCode"];
        localStorage.setItem("BizTemplateCode", this.BizTemplateCode);
      }
    }); 
   }
  TrxNo : any;
  TrxType : any = "APP";
  Token : any = localStorage.getItem(CommonConstant.TOKEN);
  inputPagingObj;
  userAccess;
  ngOnInit() {
    this.userAccess = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url="./assets/ucpaging/searchReturnHandlingSurvey.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchReturnHandlingSurvey.json";
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
    critObj.value = "ADD_SRVY_" + this.BizTemplateCode;
    critObjs.push(critObj);

    return critObjs;
  }

  event(ev){
    switch(ev.Key){
      case "ViewProdOffering":{
        AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.RowObj.prodOfferingCode, ev.RowObj.prodOfferingVersion);
        break;
      }
      case "Edit":{
        this.TrxNo = ev.RowObj.AppNo;
        window.open(environment.FoundationR3Web + "/Survey/ViewOrderExternal?TrxNo=" + this.TrxNo + "&TrxType=" + this.TrxType + "&Token=" + this.Token);
        break;
      }
    }
  }

}
