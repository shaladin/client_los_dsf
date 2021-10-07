import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { AdInsHelper } from 'app/shared/AdInsHelper';

@Component({
  selector: 'app-cessie-inquiry',
  templateUrl: './cessie-inquiry.component.html'
})
export class CessieInquiryComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();

  constructor() { }

  ngOnInit() {
      this.inputPagingObj._url = "./assets/impl/ucpaging/searchCessieInquiry.json";
      this.inputPagingObj.pagingJson = "./assets/impl/ucpaging/searchCessieInquiry.json";
  }
  GetCallBack(ev: any) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.RowObj.ProdOfferingCode, ev.RowObj.ProdOfferingVersion);
    }
  }
}
