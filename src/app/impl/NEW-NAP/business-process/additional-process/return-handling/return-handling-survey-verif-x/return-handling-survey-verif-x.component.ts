import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { ActivatedRoute, Router } from '@angular/router';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-return-handling-survey-verif-x',
  templateUrl: './return-handling-survey-verif-x.component.html'
})
export class ReturnHandlingSurveyVerifXComponent implements OnInit {

  BizTemplateCode: string;
  inputPagingObj: any;

  constructor(private route: ActivatedRoute,private router: Router,private http: HttpClient) {
    this.route.queryParams.subscribe(
      params => {
        if (params["BizTemplateCode"] != null) {
          this.BizTemplateCode = params["BizTemplateCode"];
          localStorage.setItem("BizTemplateCode", this.BizTemplateCode);
        }
      }
    ); 
  }

  ngOnInit() {
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url="./assets/ucpaging/survey/searchReturnHandlingSurveyVerif.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = "/v1" + URLConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/survey/searchReturnHandlingSurveyVerif.json";
    this.inputPagingObj.ddlEnvironments = [
      {
        name: "a.ORI_OFFICE_CODE",
        environment: environment.FoundationR3Url
      }
    ];
    this.inputPagingObj.addCritInput = this.ActAndOfficeCriteria();
  }

  ActAndOfficeCriteria() : Array<CriteriaObj> {
    var critObjs : Array<CriteriaObj> = new Array<CriteriaObj>();

    var critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionLike;
    critObj.propName = 'WTL.ACT_CODE';
    critObj.value = "ADD_SRVY_" + this.BizTemplateCode;
    critObjs.push(critObj);

    return critObjs;
  }

  event(ev) {
    // this.TrxNo = ev.RowObj.AppNo;
    // window.location.href = environment.FoundationR3Web + "/Survey/ViewOrderExternal?TrxNo=" + this.TrxNo + "&TrxType=" + this.TrxType + "&Token=" + this.Token;
  }
}
