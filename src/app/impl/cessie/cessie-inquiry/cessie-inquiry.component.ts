import { Component, OnInit } from '@angular/core';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { UcPagingObj } from 'app/shared/model/uc-paging-obj.model';

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
