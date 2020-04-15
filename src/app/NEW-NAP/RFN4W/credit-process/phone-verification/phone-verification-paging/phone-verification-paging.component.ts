import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';

@Component({
  selector: 'app-phone-verification-paging',
  templateUrl: './phone-verification-paging.component.html',
  styleUrls: ['./phone-verification-paging.component.scss']
})
export class PhoneVerificationPagingComponent implements OnInit {

  inputPagingObj: UcPagingObj;
  constructor() { }

  ngOnInit() {
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/searchAppReservedFund.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchAppReservedFund.json";

    var critInput = new CriteriaObj();
    critInput.propName = "A.APP_CURR_STEP";
    critInput.restriction = AdInsConstant.RestrictionEq;
    critInput.value = AdInsConstant.AppStepPhnVerif;
    this.inputPagingObj.addCritInput.push(critInput);

    var critInput = new CriteriaObj();
    critInput.propName = "A.LOB_CODE";
    critInput.restriction = AdInsConstant.RestrictionEq;
    critInput.value = AdInsConstant.LobCodeRFN4W;
    this.inputPagingObj.addCritInput.push(critInput);
  }

}
