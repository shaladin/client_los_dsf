import { Component, OnInit } from '@angular/core';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';

@Component({
  selector: 'app-doc-pickup-request-paging',
  templateUrl: './doc-pickup-request-paging.component.html',
  styleUrls: ['./doc-pickup-request-paging.component.scss']
})
export class DocPickupRequestPagingComponent implements OnInit {

  inputPagingObj: UcPagingObj = new UcPagingObj();

  constructor() { }

  ngOnInit() {   
    this.inputPagingObj._url = "./assets/ucpaging/searchDocPickupRequest.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchDocPickupRequest.json"; 
  }

  GetCallBack(ev: any) {
    console.log(ev);
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.RowObj.ProdOfferingCode, ev.RowObj.ProdOfferingVersion);
    }
  }

}
