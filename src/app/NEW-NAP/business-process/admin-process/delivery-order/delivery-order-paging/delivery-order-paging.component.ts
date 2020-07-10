import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { ActivatedRoute } from '@angular/router';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-delivery-order-paging',
  templateUrl: './delivery-order-paging.component.html'
})
export class DeliveryOrderPagingComponent implements OnInit {
  inputPagingObj: UcPagingObj;
  bizTemplateCode: string;
  token : any = localStorage.getItem("Token");
  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      if (params["BizTemplateCode"] != null) {
        this.bizTemplateCode = params["BizTemplateCode"];
        localStorage.setItem("BizTemplateCode",this.bizTemplateCode);
      }
      else{
        this.bizTemplateCode = localStorage.getItem("BizTemplateCode");
      }
    });
  }
  
  ngOnInit() {
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/searchDeliveryOrder.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchDeliveryOrder.json";
    this.inputPagingObj.addCritInput = new Array();

    var critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionEq;
    critObj.propName = 'WF.ACT_CODE';
    critObj.value = "DO_" + this.bizTemplateCode;

    this.inputPagingObj.addCritInput.push(critObj);

    var critBizTemplate = new CriteriaObj();
    critBizTemplate.restriction = AdInsConstant.RestrictionEq;
    critBizTemplate.propName = 'AP.BIZ_TEMPLATE_CODE';
    critBizTemplate.value = this.bizTemplateCode;

    this.inputPagingObj.addCritInput.push(critBizTemplate);

    
  }
 
  
  GetCallBack(ev: any){ 
    if(ev.Key == "ViewProdOffering"){
      var link = environment.FoundationR3Web + "/Product/OfferingView?prodOfferingHId=" + 0 + "&prodOfferingCode=" + ev.RowObj.ProdOfferingCode + "&prodOfferingVersion=" + ev.RowObj.ProdOfferingVersion  + "&Token=" + this.token;
       window.open(link, '_blank');   
    }
    else if(ev.Key == "ViewAgrmnt"){
      var link = environment.losR3Web + "/Nap/View/AgrmntView?AgrmntId=" + ev.RowObj.AgrmntId;
      window.open(link, '_blank');  
    }    
  }
}
