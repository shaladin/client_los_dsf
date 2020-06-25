import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';

@Component({
  selector: 'app-po-extension-paging',
  templateUrl: './po-extension-paging.component.html',
  styleUrls: ['./po-extension-paging.component.scss']
})
export class PoExtensionPagingComponent implements OnInit {
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
    this.inputPagingObj._url = "./assets/ucpaging/searchPOExtension.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchPOExtension.json";

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
      this.http.post(AdInsConstant.GetProdOfferingHByCode, {ProdOfferingCode : ev.RowObj.ProdOfferingCode}).subscribe(
        response => {
          window.open(environment.FoundationR3Web + "/Product/OfferingView?prodOfferingHId=" + response['ProdOfferingHId'], '_blank');
        },
        (error) => {
          console.log(error);
        }
      );
    }else if(ev.Key == "suppl"){
      this.http.post(AdInsConstant.GetVendorByVendorCode, {VendorCode : ev.RowObj.SupplCode}).subscribe(
        response => {
          window.open(environment.FoundationR3Web + "/Vendor/Branch/View?VendorId=" + response['VendorId'], '_blank');
        },
        (error) => {
          console.log(error);
        }
      );
    }else if(ev.Key == "agrmnt"){
      var bizTemplateCode = ev.RowObj.BizTemplateCode;

      if(bizTemplateCode == "CF4W" || bizTemplateCode == "CFRFN4W" || bizTemplateCode == "FACTORING"){
        window.open( environment.losR3Web + "/Nap/View/AgrmntView?AgrmntId=" + ev.RowObj.AgrmntId, "_blank");
      }
      else if(bizTemplateCode == "FL4W"){
        window.open( environment.losR3Web + "/Nap/View/AgrmntView?AgrmntId=" + ev.RowObj.AgrmntId, "_blank");
      }
    }
  }
}
