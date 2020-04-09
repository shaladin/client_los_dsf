import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';

@Component({
  selector: 'app-commission-paging',
  templateUrl: './commission-paging.component.html',
  styleUrls: ['./commission-paging.component.scss']
})
export class CommissionPagingComponent implements OnInit {

  inputPagingObj: UcPagingObj;
  constructor() { }

  ngOnInit() {
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url="./assets/ucpaging/searchCommission.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchCommission.json";

    var critInput = new CriteriaObj();
    critInput.propName = "A.APP_CURR_STEP";
    critInput.restriction = AdInsConstant.RestrictionEq;
    critInput.value = AdInsConstant.AppStepComm;
    this.inputPagingObj.addCritInput.push(critInput);

    var critInput = new CriteriaObj();
    critInput.propName = "A.LOB_CODE";
    critInput.restriction = AdInsConstant.RestrictionEq;
    critInput.value = AdInsConstant.LobCodeRFN4W;
    this.inputPagingObj.addCritInput.push(critInput);
  }

}
