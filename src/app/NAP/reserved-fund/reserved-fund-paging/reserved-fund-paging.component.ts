import { environment } from "environments/environment";
import { Component, OnInit, ViewChild } from "@angular/core";
import { AdInsConstant } from "app/shared/AdInstConstant";
import { DecimalPipe } from "@angular/common";
import { UcPagingObj } from "app/shared/model/UcPagingObj.Model";
import { CriteriaObj } from "../../../shared/model/CriteriaObj.model";

@Component({
  selector: "reserved-fund-paging",
  templateUrl: "./reserved-fund-paging.component.html",
  providers: [DecimalPipe]
})
export class RsvFundPagingComponent implements OnInit {
  inputPagingObj: any;
  arrCrit: any;
  constructor() { }

  ngOnInit() {
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/searchAppReservedFund.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchAppReservedFund.json";

    this.arrCrit = new Array();
    var critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionLike;
    critObj.propName = 'APP_CURR_STEP';
    critObj.value = AdInsConstant.AppStepRSVFund;
    this.arrCrit.push(critObj);
    this.inputPagingObj.addCritInput = this.arrCrit;
  }
}
