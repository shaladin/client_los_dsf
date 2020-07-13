import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { HttpClient } from '@angular/common/http';
import { CenterGrpOfficeMbrObj } from 'app/shared/model/RefOffice/CenterGrpOfficeMbrObj.Model';
import { ActivatedRoute, Router } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';

@Component({
  selector: 'app-return-handling-com-rsvfund-paging',
  templateUrl: './return-handling-com-rsvfund-paging.component.html',
  styleUrls: []
})
export class ReturnHandlingComRsvfundPagingComponent implements OnInit {

  BizTemplateCode: string;
  token : any = localStorage.getItem(CommonConstant.TOKEN);
  constructor(private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router) {
    this.route.queryParams.subscribe(params => {
      if (params["BizTemplateCode"] != null) {
        this.BizTemplateCode = params["BizTemplateCode"];
        localStorage.setItem("BizTemplateCode", this.BizTemplateCode);
      }
    });
   }
  userAccess;
  inputPagingObj;
  ngOnInit() {
    this.userAccess = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));

    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/searchReturnHandlingCommission.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchReturnHandlingCommission.json";
    this.inputPagingObj.ddlEnvironments = [
      {
        name: "a.ORI_OFFICE_CODE",
        environment: environment.FoundationR3Url
      }
    ];

    this.inputPagingObj.addCritInput = this.ActAndOfficeCriteria();
  }

  ActAndOfficeCriteria(): Array<CriteriaObj> {
    var critObjs: Array<CriteriaObj> = new Array<CriteriaObj>();

    var critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionLike;
    critObj.propName = 'WTL.ACT_CODE';
    critObj.value = "EDIT_COM_RSV_FND_" + this.BizTemplateCode;
    critObjs.push(critObj);

    return critObjs;
  }

  GetCallBack(ev: any){
    if(ev.Key == "ViewProdOffering"){
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion( ev.RowObj.prodOfferingCode, ev.RowObj.prodOfferingVersion, this.token );  
    }
  }
}
