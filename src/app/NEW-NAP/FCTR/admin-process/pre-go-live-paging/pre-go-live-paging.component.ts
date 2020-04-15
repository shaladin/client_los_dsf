import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';

@Component({
  selector: 'app-pre-go-live-paging',
  templateUrl: './pre-go-live-paging.component.html',
  styleUrls: ['./pre-go-live-paging.component.scss']
})
export class PreGoLivePagingComponent implements OnInit {

  inputPagingObj: UcPagingObj;
  constructor() { }

  ngOnInit() {
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/searchPreGoLive.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchPreGoLive.json";

    var critInput = new CriteriaObj();
    critInput.propName = "app.LOB_CODE";
    critInput.restriction = AdInsConstant.RestrictionEq;
    critInput.value = AdInsConstant.LobCodeFCTR;
    this.inputPagingObj.addCritInput.push(critInput);
  }
}
