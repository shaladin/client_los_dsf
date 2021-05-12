import { Component, OnInit } from "@angular/core";
import { AdInsConstant } from "app/shared/AdInstConstant";
import { UcPagingObj } from "app/shared/model/UcPagingObj.Model";
import { CriteriaObj } from "app/shared/model/CriteriaObj.Model";
@Component({
  selector: 'app-prod-ho-deact-paging',
  templateUrl: './prod-ho-deact-paging.component.html'
})
export class ProdHoDeactPagingComponent implements OnInit {
  InputPagingObj: UcPagingObj = new UcPagingObj();
  ArrCrit: Array<CriteriaObj> = new Array<CriteriaObj>();

  constructor() { }

  ngOnInit() {
    this.InputPagingObj._url = "./assets/ucpaging/product/searchProductHODeactivate.json";
    this.InputPagingObj.pagingJson = "./assets/ucpaging/product/searchProductHODeactivate.json";

    let critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionLike;
    critObj.propName = 'A.PROD_STAT';
    critObj.value = 'ACT';
    this.ArrCrit.push(critObj);
    
    this.InputPagingObj.addCritInput = this.ArrCrit;
  }
}
