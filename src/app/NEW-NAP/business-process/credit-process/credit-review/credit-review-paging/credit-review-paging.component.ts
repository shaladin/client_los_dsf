import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-credit-review-paging',
  templateUrl: './credit-review-paging.component.html',
  styleUrls: []
})
export class CreditReviewPagingComponent implements OnInit {
  BizTemplateCode: string;
  inputPagingObj: UcPagingObj = new UcPagingObj();
  arrCrit: Array<any> = new Array(); 
  token : any = localStorage.getItem("Token");
  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      if (params["BizTemplateCode"] != null) {
        this.BizTemplateCode = params["BizTemplateCode"];
        localStorage.setItem("BizTemplateCode", this.BizTemplateCode);
      }
    });
  }
  
  ngOnInit() {
    this.inputPagingObj._url="./assets/ucpaging/searchCreditReview.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchCreditReview.json";

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
    critObj.value = "RVW_"+this.BizTemplateCode;
    arrCrit.push(critObj);
    
    this.inputPagingObj.addCritInput = arrCrit;
  }
  GetCallBack(ev: any){
    console.log(ev);
    if(ev.Key == "ViewProdOffering"){
      var link = environment.FoundationR3Web + "/Product/OfferingView?prodOfferingHId=0&prodOfferingCode=" + ev.RowObj.prodOfferingCode + "&prodOfferingVersion=" + ev.RowObj.prodOfferingVersion + "&Token=" + this.token;
      window.open(link, '_blank');
    }
  }

}
