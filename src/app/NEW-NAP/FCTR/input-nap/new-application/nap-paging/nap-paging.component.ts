import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';

@Component({
  selector: 'app-nap-paging',
  templateUrl: './nap-paging.component.html',
  styleUrls: ['./nap-paging.component.scss']
})
export class NapPagingComponent implements OnInit {

  inputPagingObj: UcPagingObj = new UcPagingObj();
  constructor() { }

  ngOnInit() {
    this.inputPagingObj._url="./assets/ucpaging/searchApp.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchApp.json";

    var critInput = new CriteriaObj();
    critInput.propName = "a.LOB_CODE";
    critInput.restriction = AdInsConstant.RestrictionEq;
    critInput.value = AdInsConstant.LobCodeFCTR;
    this.inputPagingObj.addCritInput.push(critInput);
  }

}
