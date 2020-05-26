import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';

@Component({
  selector: 'app-commission-reserved-fund-paging',
  templateUrl: './commission-reserved-fund-paging.component.html',
  styleUrls: []
})
export class CommissionReservedFundPagingComponent implements OnInit {

  constructor() { }

  inputPagingObj;
  ngOnInit() {
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url="./assets/ucpaging/searchCommission.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchCommission.json";

    // var currentUserContext = JSON.parse(localStorage.getItem("UserContext"));
    // var addCrit = new CriteriaObj();
    // addCrit.DataType = 'text';
    // addCrit.propName = 'WTL.USERNAME';
    // addCrit.restriction = AdInsConstant.RestrictionIn;
    // var arrayString = new Array<string>();
    // arrayString.push(currentUserContext["UserName"]);
    // addCrit.listValue = arrayString;

    // this.inputPagingObj.addCritInput.push(addCrit);

  }

}
