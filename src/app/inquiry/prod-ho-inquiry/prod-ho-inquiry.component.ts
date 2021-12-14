import { Component, OnInit } from '@angular/core';
import { WhereValueObj, UcPagingObj } from 'app/shared/model/uc-paging-obj.model';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';

@Component({
  selector: 'app-prod-ho-inquiry',
  templateUrl: './prod-ho-inquiry.component.html'
})
export class ProdHoInquiryComponent implements OnInit {
  InputPagingObj: UcPagingObj = new UcPagingObj();
  readonly AddLink: string = NavigationConstant.PRODUCT_HO_ADD;
  
  constructor() { }

  ngOnInit() {
    let whereValueObj = new WhereValueObj();
    whereValueObj.property = "ProdStat";
    whereValueObj.value = "RET";
    this.InputPagingObj.whereValue.push(whereValueObj);

    this.InputPagingObj._url = "./assets/ucpaging/product/searchProductHOInquiry.json";
    this.InputPagingObj.pagingJson = "./assets/ucpaging/product/searchProductHOInquiry.json";
  }

}
