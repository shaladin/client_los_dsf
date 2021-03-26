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

  constructor(private route: ActivatedRoute, private router: Router) { }
  inputPagingObj: any;
  ngOnInit() {
    this.inputPagingObj =new UcPagingObj();
    this.inputPagingObj._url="./assets/ucpaging/product/searchProductHOReview.json";
    this.inputPagingObj.enviromentUrl = environment.FoundationR3Url;
    this.inputPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/product/searchProductHOReview.json"; 
  }
}
