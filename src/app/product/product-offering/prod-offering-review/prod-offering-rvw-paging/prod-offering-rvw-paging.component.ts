import { Component, OnInit } from '@angular/core';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-prod-offering-rvw-paging',
  templateUrl: './prod-offering-rvw-paging.component.html'
})
export class ProdOfferingRvwPagingComponent implements OnInit {

  inputPagingObj: UcPagingObj = new UcPagingObj();
  
  constructor() { }
  
  ngOnInit() {
    this.inputPagingObj._url="./assets/ucpaging/product/searchProductOfferingReview.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/product/searchProductOfferingReview.json"; 
  }
}
