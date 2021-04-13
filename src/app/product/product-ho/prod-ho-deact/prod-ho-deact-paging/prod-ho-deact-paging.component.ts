import { environment } from "environments/environment";
import { Component, OnInit } from "@angular/core";
import { AdInsConstant } from "app/shared/AdInstConstant";
import { UcPagingObj } from "app/shared/model/UcPagingObj.Model";
import { CriteriaObj } from "app/shared/model/CriteriaObj.Model";
import { URLConstant } from "app/shared/constant/URLConstant";
@Component({
  selector: 'app-prod-ho-deact-paging',
  templateUrl: './prod-ho-deact-paging.component.html'
})
export class ProdHoDeactPagingComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  arrCrit: Array<CriteriaObj> = new Array<CriteriaObj>();

  constructor() { }

  ngOnInit() {
    this.inputPagingObj._url = "./assets/ucpaging/product/searchProductHODeactivate.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/product/searchProductHODeactivate.json";

    var critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionLike;
    critObj.propName = 'A.PROD_STAT';
    critObj.value = 'ACT';
    this.arrCrit.push(critObj);
    
    this.inputPagingObj.addCritInput = this.arrCrit;
  }
}
