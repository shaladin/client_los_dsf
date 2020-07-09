import { Component, OnInit } from '@angular/core';
import { UcpagingModule } from '@adins/ucpaging';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { AdInsHelper } from 'app/shared/AdInsHelper';

@Component({
  selector: 'app-agrmnt-activation-paging',
  templateUrl: './agrmnt-activation-paging.component.html',
  styleUrls: ['./agrmnt-activation-paging.component.scss']
})
export class AgrmntActivationPagingComponent implements OnInit {
  inputPagingObj: any;
  BizTemplateCode: string;

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {
    this.route.queryParams.subscribe(params => {
      if (params['BizTemplateCode'] != null) {
        this.BizTemplateCode = params['BizTemplateCode'];
        localStorage.setItem("BizTemplateCode", this.BizTemplateCode);
      }
    });
  }

  ngOnInit() {
    this.inputPagingObj = new UcpagingModule();
    this.inputPagingObj._url = "./assets/ucpaging/searchAgrmntActivation.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchAgrmntActivation.json";

    this.inputPagingObj.ddlEnvironments = [
      {
        name: "DISTRIBUTION_STAT",
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
    critObj.value = "AGR_"+this.BizTemplateCode;
    arrCrit.push(critObj);

    this.inputPagingObj.addCritInput = arrCrit;
  }

  GetCallBack(ev: any){
    if(ev.Key == "ViewProdOffering"){
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion( ev.RowObj.ProdOfferingCode, ev.RowObj.ProdOfferingVersion);   
    }
  }

}
