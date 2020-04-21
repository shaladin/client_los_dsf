import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';

@Component({
  selector: 'app-legal-review-paging',
  templateUrl: './legal-review-paging.component.html',
})
export class LegalReviewPagingComponent implements OnInit {
  inputPagingObj: UcPagingObj;
  arrCrit: any;

  constructor() { }

  ngOnInit() {
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/searchLegalReview.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchLegalReview.json";

    const addCritMouStat = new CriteriaObj();
    addCritMouStat.DataType = 'text';
    addCritMouStat.propName = 'MOU.MOU_STAT';
    addCritMouStat.restriction = AdInsConstant.RestrictionNotIn;
    addCritMouStat.value = 'LRV';
    this.arrCrit.push(addCritMouStat);

    const addCritOfficeCode = new CriteriaObj();
    addCritOfficeCode.DataType = 'text';
    addCritOfficeCode.propName = 'WTL.OFFICE_CODE';
    addCritOfficeCode.restriction = AdInsConstant.RestrictionNotIn;
    addCritOfficeCode.value = 'HO';
    this.arrCrit.push(addCritOfficeCode);
  }
}
