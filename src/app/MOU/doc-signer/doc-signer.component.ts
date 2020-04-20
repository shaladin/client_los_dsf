import { Component, OnInit } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { DecimalPipe } from '@angular/common';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { UcpagingComponent } from '@adins/ucpaging';
import { environment } from 'environments/environment';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';

@Component({
  selector: 'app-doc-signer',
  templateUrl: './doc-signer.component.html',
  providers: [DecimalPipe]
})
export class DocSignerComponent implements OnInit {
  inputPagingObj: any;
  arrCrit: any;
  
  constructor() { }

  ngOnInit() {
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/searchMouCustDocSigner.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchMouCustDocSigner.json";

    this.arrCrit = new Array();
    
    const addCritMouStat = new CriteriaObj();
    addCritMouStat.DataType = 'text';
    addCritMouStat.propName = 'MOU.MOU_STAT';
    addCritMouStat.restriction = AdInsConstant.RestrictionEq;
    addCritMouStat.value = 'MOU_DOC_SIGN';
    this.arrCrit.push(addCritMouStat);

    const addCritOfficeCode = new CriteriaObj();
    addCritOfficeCode.DataType = 'text';
    addCritOfficeCode.propName = 'WTL.OFFICE_CODE';
    addCritOfficeCode.restriction = AdInsConstant.RestrictionEq;
    addCritOfficeCode.value = 'HO';
    this.arrCrit.push(addCritOfficeCode);

    this.inputPagingObj.addCritInput = this.arrCrit;
  }
}
