import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';

@Component({
  selector: 'app-prod-offering-rvw-paging',
  templateUrl: './prod-offering-rvw-paging.component.html'
})
export class ProdOfferingRvwPagingComponent implements OnInit {
  InputPagingObj: UcPagingObj = new UcPagingObj();

  constructor() { }

  ngOnInit() {
    this.InputPagingObj._url = "./assets/ucpaging/product/searchProductOfferingReview.json";
    this.InputPagingObj.pagingJson = "./assets/ucpaging/product/searchProductOfferingReview.json";
  }
}
