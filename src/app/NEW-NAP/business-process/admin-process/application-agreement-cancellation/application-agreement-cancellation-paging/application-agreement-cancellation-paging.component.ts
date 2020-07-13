import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { Router } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-application-agreement-cancellation-paging',
  templateUrl: './application-agreement-cancellation-paging.component.html'
})
export class ApplicationAgreementCancellationPagingComponent implements OnInit {
  inputPagingObj: any;
  token: any = localStorage.getItem(CommonConstant.TOKEN);
  constructor(private router: Router) { }

  ngOnInit() {

    var critInputAppStatNotCancel = new CriteriaObj();
    critInputAppStatNotCancel.propName = "ap.APP_STAT";
    critInputAppStatNotCancel.restriction = AdInsConstant.RestrictionNeq;
    critInputAppStatNotCancel.value = CommonConstant.AppStatCancel;

    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/searchApplicationAgreementCancellation.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchApplicationAgreementCancellation.json";
    this.inputPagingObj.addCritInput = new Array();

    this.inputPagingObj.addCritInput.push(critInputAppStatNotCancel);

  }
  GetCallBack(ev: any) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.RowObj.ProdOfferingCode, ev.RowObj.ProdOfferingVersion, this.token);
    }
  }
}
