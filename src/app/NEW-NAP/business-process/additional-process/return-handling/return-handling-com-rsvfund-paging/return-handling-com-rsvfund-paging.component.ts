import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';

@Component({
  selector: 'app-return-handling-com-rsvfund-paging',
  templateUrl: './return-handling-com-rsvfund-paging.component.html',
  styleUrls: []
})
export class ReturnHandlingComRsvfundPagingComponent implements OnInit {

  constructor() { }

  inputPagingObj;
  ngOnInit() {
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url="./assets/ucpaging/searchReturnHandlingCommission.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchReturnHandlingCommission.json";

    var currentUserContext = JSON.parse(localStorage.getItem("UserAccess"));
    var addCrit = new CriteriaObj();
    addCrit.DataType = 'text';
    addCrit.propName = 'WTL.USERNAME';
    addCrit.restriction = AdInsConstant.RestrictionIn;
    var arrayString = new Array<string>();
    arrayString.push(currentUserContext["UserName"]);
    arrayString.push("");
    addCrit.listValue = arrayString;

    this.inputPagingObj.addCritInput.push(addCrit);
  }

}
