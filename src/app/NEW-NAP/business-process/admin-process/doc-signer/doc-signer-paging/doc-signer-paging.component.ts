import { Component, OnInit } from '@angular/core';
import { UcPagingObj, WhereValueObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';

@Component({
  selector: 'app-doc-signer-paging',
  templateUrl: './doc-signer-paging.component.html'
})
export class DocSignerPagingComponent implements OnInit {
  inputPagingObj: UcPagingObj;
  link: string;
  BizTemplateCode: string;
  
  constructor(private route: ActivatedRoute, private http: HttpClient) { 
    this.route.queryParams.subscribe(params => {
      if (params["BizTemplateCode"] != null) {
        this.BizTemplateCode = params["BizTemplateCode"];
      }
  });
  }

  ngOnInit() {
    var pagingJsonPath = "./assets/ucpaging/searchDocSigner.json";

    if(this.BizTemplateCode == CommonConstant.OPL){
      pagingJsonPath = "./assets/ucpaging/opl/search-doc-signer-opl-paging.json"
    }

    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = pagingJsonPath;
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = pagingJsonPath;

    if (this.BizTemplateCode == CommonConstant.OPL) {
      this.inputPagingObj.ddlEnvironments = [
        {
          name: "a.ORI_OFFICE_CODE",
          environment: environment.FoundationR3Url
        }
      ];

      let arrCrit = new Array();
      let critObj = new CriteriaObj();
      critObj.restriction = AdInsConstant.RestrictionLike;
      critObj.propName = 'WTL.ACT_CODE';
      critObj.value = "DOC_SIGN_" + this.BizTemplateCode;
      arrCrit.push(critObj);

      this.inputPagingObj.addCritInput = arrCrit;
    }
    else
    {
      var whereValueObj = new WhereValueObj();
      whereValueObj.property = "BizTemplateCode";
      whereValueObj.value = this.BizTemplateCode;
      this.inputPagingObj.whereValue.push(whereValueObj);
    }

    // this.inputPagingObj.whereValue.push({property: "BizTemplateCode", value: ""});
    // this.inputPagingObj.whereValue.find(x => x.property == "BizTemplateCode").value = this.BizTemplateCode;
  }

  getEvent(ev){
    if(ev.Key == "prodOff"){
      this.http.post(URLConstant.GetProdOfferingHByCode, {ProdOfferingCode : ev.RowObj.ProdOfferingCode}).subscribe(
        response => {
          AdInsHelper.OpenProdOfferingViewByProdOfferingHId(response['ProdOfferingHId']);
        });
    }else if(ev.Key == "agrmnt"){
      AdInsHelper.OpenAgrmntViewByAgrmntId(ev.RowObj.AgrmntId);
    }
  }
}
