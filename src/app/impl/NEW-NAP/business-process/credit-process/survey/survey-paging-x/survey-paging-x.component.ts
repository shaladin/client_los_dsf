import { Component, OnInit } from '@angular/core';
import { UcpagingModule } from '@adins/ucpaging';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-survey-paging-x',
  templateUrl: './survey-paging-x.component.html'
})
export class SurveyPagingXComponent implements OnInit {
  inputPagingObj: any;
  BizTemplateCode: string;
  ActCode: string;

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {
    this.route.queryParams.subscribe(params => {
      if (params['BizTemplateCode'] != null) {
        this.BizTemplateCode = params['BizTemplateCode'];
        localStorage.setItem("BizTemplateCode", this.BizTemplateCode);
      }
    });
  }

  ngOnInit() {
      this.ActCode = 'SURVEY_';
    this.inputPagingObj = new UcpagingModule();
    this.inputPagingObj._url = "./assets/ucpaging/survey/searchSurvey.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = "/v1" + URLConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/survey/searchSurvey.json";

    this.inputPagingObj.ddlEnvironments = [
      {
        name: "A.ORI_OFFICE_CODE",
        environment: environment.FoundationR3Url
      },
      {
        name: "TASK_CLAIM_STAT",
        environment: environment.FoundationR3Url
      }
    ];

    var arrCrit = new Array();
    
    var critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionLike;
    critObj.propName = 'WF.ACT_CODE';
    critObj.value = this.ActCode+this.BizTemplateCode;
    arrCrit.push(critObj);

    this.inputPagingObj.addCritInput = arrCrit;
  }

  GetCallBack(ev: any){
    if(ev.Key == "ViewProdOffering"){
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion( ev.RowObj.ProdOfferingCode, ev.RowObj.ProdOfferingVersion);   
    }
  }

}
