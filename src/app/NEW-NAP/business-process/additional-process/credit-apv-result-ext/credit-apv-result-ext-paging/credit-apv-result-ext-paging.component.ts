import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-credit-apv-result-ext-paging',
  templateUrl: './credit-apv-result-ext-paging.component.html'
})
export class CreditApvResultExtPagingComponent implements OnInit {
  inputPagingObj: UcPagingObj;
  link: string;
  BizTemplateCode: string;

  constructor(private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private router: Router) { 
    this.route.queryParams.subscribe(params => {
      if (params["BizTemplateCode"] != null) {
        this.BizTemplateCode = params["BizTemplateCode"];
      }
  });
  }
  
  ngOnInit() {
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/searchCrdApvResExtension.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchCrdApvResExtension.json";

    this.inputPagingObj.addCritInput = new Array();
    
    var critObj = new CriteriaObj();
    critObj.DataType = 'text';
    critObj.propName = 'A.BIZ_TEMPLATE_CODE';
    critObj.restriction = AdInsConstant.RestrictionEq;
    critObj.value = this.BizTemplateCode;
    this.inputPagingObj.addCritInput.push(critObj);
  }

  getEvent(ev){
    if(ev.Key == "prodOff"){
      this.http.post(URLConstant.GetProdOfferingHByCode, {ProdOfferingCode : ev.RowObj.ProdOfferingCode}).subscribe(
        response => {
          AdInsHelper.OpenProdOfferingViewByProdOfferingHId(response['ProdOfferingHId']);
        });
    }else if(ev.Key == "suppl"){
      this.http.post(URLConstant.GetVendorByVendorCode, {VendorCode : ev.RowObj.SupplCode}).subscribe(
        response => {
          AdInsHelper.OpenVendorBranchViewByVendorId(response['VendorId']);
        });
    }else if(ev.Key == "agrmnt"){
      AdInsHelper.OpenAgrmntViewByAgrmntId(ev.RowObj.AgrmntId);
    }
  }
}
