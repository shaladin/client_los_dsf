import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-application-agreement-cancellation-paging',
  templateUrl: './application-agreement-cancellation-paging.component.html',
  styleUrls: ['./application-agreement-cancellation-paging.component.scss']
})
export class ApplicationAgreementCancellationPagingComponent implements OnInit {
  inputPagingObj: any;
  token: any = localStorage.getItem("Token");
  constructor(private router: Router) { }

  ngOnInit() {

    var critInputAppStatNotCancel = new CriteriaObj();
    critInputAppStatNotCancel.propName = "ap.APP_STAT";
    critInputAppStatNotCancel.restriction = AdInsConstant.RestrictionNeq;
    critInputAppStatNotCancel.value = AdInsConstant.AppStatCancel;

    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/searchApplicationAgreementCancellation.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchApplicationAgreementCancellation.json";
    this.inputPagingObj.addCritInput = new Array();

    this.inputPagingObj.addCritInput.push(critInputAppStatNotCancel);

  }
  GetCallBack(ev: any) {
    if (ev.Key == "ViewProdOffering") {
      var link = environment.FoundationR3Web + "/Product/OfferingView?prodOfferingHId=0&prodOfferingCode=" + ev.RowObj.ProdOfferingCode + "&prodOfferingVersion=" + ev.RowObj.ProdOfferingVersion + "&Token=" + this.token;
      this.router.navigate([]).then(result => { window.open(link, '_blank'); });
    }
  }
}
