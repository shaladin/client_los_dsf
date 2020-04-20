import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';

@Component({
  selector: 'app-return-handling-paging',
  templateUrl: './return-handling-paging.component.html'
})
export class ReturnHandlingPagingComponent implements OnInit {
  inputPagingObj: UcPagingObj;
  
  ngOnInit() {
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/searchReturnHandling.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchReturnHandling.json";
    this.inputPagingObj.addCritInput = new Array();

    // var critObj = new CriteriaObj();
    // critObj.restriction = AdInsConstant.RestrictionEq;
    // critObj.propName = 'A.APP_CURR_STEP';
    // critObj.value = "CINV";
    // this.inputPagingObj.addCritInput.push(critObj);
  }
}
