import { environment } from "environments/environment";
import { Component, OnInit } from "@angular/core";
import { AdInsConstant } from "app/shared/AdInstConstant";
import { DecimalPipe } from "@angular/common";
import { UcPagingObj } from "app/shared/model/UcPagingObj.Model";
import { CriteriaObj } from "app/shared/model/CriteriaObj.model";
import { ActivatedRoute } from "@angular/router";
import { AdInsHelper } from "app/shared/AdInsHelper";
import { URLConstant } from "app/shared/constant/URLConstant";

@Component({
  selector: "phone-verification-paging",
  templateUrl: "./phone-verification-paging.component.html",
  //providers: [DecimalPipe]
})

export class PhoneVerificationPagingComponent implements OnInit {
  inputPagingObj: UcPagingObj;
  BizTemplateCode : string;
  token : any = localStorage.getItem("Token");
  constructor(private route: ActivatedRoute) { 
    this.route.queryParams.subscribe(params => {
      if (params['BizTemplateCode'] != null) {
        this.BizTemplateCode = params['BizTemplateCode'];
        localStorage.setItem("BizTemplateCode",this.BizTemplateCode);
      }
    });
  }

  ngOnInit() {
    var userAccess = JSON.parse(localStorage.getItem("UserAccess"))
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/searchAppPhoneVerif.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchAppPhoneVerif.json";

    this.inputPagingObj.ddlEnvironments = [
      {
        name: "a.ORI_OFFICE_CODE",
        environment: environment.FoundationR3Url
      }
    ];

    var arrCrit = new Array();
    var critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionLike;
    critObj.propName = 'WTL.ACT_CODE';
    critObj.value = "PHN_"+this.BizTemplateCode;
    arrCrit.push(critObj);

    this.inputPagingObj.addCritInput = arrCrit;
  }
  GetCallBack(ev: any){
    console.log(ev);
    if(ev.Key == "ViewProdOffering"){ 
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion( ev.RowObj.prodOfferingCode, ev.RowObj.prodOfferingVersion, this.token );
    }
  }
}
