import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
@Component({
  selector: 'app-prod-ho-rvw-paging',
  templateUrl: './prod-ho-rvw-paging.component.html'
})
export class ProdHoRvwPagingComponent implements OnInit {
  InputPagingObj: UcPagingObj = new UcPagingObj();

  constructor() { }

  ngOnInit() {
    this.InputPagingObj._url = "./assets/ucpaging/product/searchProductHOReview.json";
    this.InputPagingObj.pagingJson = "./assets/ucpaging/product/searchProductHOReview.json";
  }
}
