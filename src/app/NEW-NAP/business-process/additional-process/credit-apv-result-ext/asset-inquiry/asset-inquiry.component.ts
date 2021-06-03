import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';

@Component({
  selector: 'app-asset-inquiry',
  templateUrl: './asset-inquiry.component.html'
})
export class AssetInquiryComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();

  constructor() { }

  ngOnInit() {
    this.inputPagingObj._url = "./assets/ucpaging/searchAssetInquiry.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchAssetInquiry.json";
  }

}
