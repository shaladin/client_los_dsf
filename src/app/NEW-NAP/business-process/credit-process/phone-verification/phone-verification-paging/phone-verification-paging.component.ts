import { environment } from "environments/environment";
import { Component, OnInit, ViewChild } from "@angular/core";
import { AdInsConstant } from "app/shared/AdInstConstant";
import { DecimalPipe } from "@angular/common";
import { UcPagingObj } from "app/shared/model/UcPagingObj.Model";
import { CriteriaObj } from "app/shared/model/CriteriaObj.model";

@Component({
  selector: "phone-verification-paging",
  templateUrl: "./phone-verification-paging.component.html",
  providers: [DecimalPipe]
})
export class PhoneVerificationPagingComponent implements OnInit {
  inputPagingObj: any;
  arrCrit: any;
  constructor() { }

  ngOnInit() {
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/searchAppPhoneVerif.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchAppPhoneVerif.json";

    this.arrCrit = new Array();
    var critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionLike;
    critObj.propName = 'a.APP_CURR_STEP';
    critObj.value = AdInsConstant.AppStepPhnVerif;
    this.arrCrit.push(critObj);
    var critTypeObj = new CriteriaObj();
    critTypeObj.restriction = AdInsConstant.RestrictionLike;
    critTypeObj.propName = 'ac.MR_CUST_TYPE_CODE';
    critTypeObj.value = AdInsConstant.CustTypePersonal;
    this.arrCrit.push(critTypeObj);
    this.inputPagingObj.addCritInput = this.arrCrit;
  }
}
