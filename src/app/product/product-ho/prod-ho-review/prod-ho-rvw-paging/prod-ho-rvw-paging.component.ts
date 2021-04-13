import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { ActivatedRoute, Router } from '@angular/router'; 
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
@Component({
  selector: 'app-prod-ho-rvw-paging',
  templateUrl: './prod-ho-rvw-paging.component.html'
})
export class ProdHoRvwPagingComponent implements OnInit {

  inputPagingObj: UcPagingObj  = new UcPagingObj();

  constructor() { }

  ngOnInit() {
    this.inputPagingObj._url = "./assets/ucpaging/product/searchProductHOReview.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/product/searchProductHOReview.json"; 
  }
}
