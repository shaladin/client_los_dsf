import { Component, OnInit } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';

@Component({
  selector: 'app-mou-review-paging',
  templateUrl: './mou-review-paging.component.html',
  styleUrls: ['./mou-review-paging.component.scss']
})
export class MouReviewPagingComponent implements OnInit {
  inputPagingObj: any;
  arrCrit: any;
  
  constructor() { }

  ngOnInit() {
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/mou/searchMouReview.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;
    console.log(AdInsConstant.GetPagingObjectBySQL);
    this.inputPagingObj.pagingJson = "./assets/ucpaging/mou/searchMouReview.json";

    const addCritMouStat = new CriteriaObj();
    addCritMouStat.DataType = 'text';
    addCritMouStat.propName = 'MOU.MOU_STAT';
    addCritMouStat.restriction = AdInsConstant.RestrictionNotIn;
    addCritMouStat.value = 'MOU_RVW';
    this.arrCrit.push(addCritMouStat);

    const addCritOfficeCode = new CriteriaObj();
    addCritOfficeCode.DataType = 'text';
    addCritOfficeCode.propName = 'WTL.OFFICE_CODE';
    addCritOfficeCode.restriction = AdInsConstant.RestrictionNotIn;
    addCritOfficeCode.value = 'HO';
    this.arrCrit.push(addCritOfficeCode);
  }
}
