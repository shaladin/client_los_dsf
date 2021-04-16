import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
@Component({
  selector: 'app-prod-ho-rvw-paging',
  templateUrl: './prod-ho-rvw-paging.component.html'
})
export class ProdHoRvwPagingComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();

  constructor() { }

  ngOnInit() {
    this.inputPagingObj._url = "./assets/ucpaging/product/searchProductHOReview.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/product/searchProductHOReview.json";
  }
}
