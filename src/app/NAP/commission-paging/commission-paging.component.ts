import { Component, OnInit } from '@angular/core';
import { UcpagingModule } from '@adins/ucpaging';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';

@Component({
  selector: 'app-commission-paging',
  templateUrl: './commission-paging.component.html',
  styleUrls: ['./commission-paging.component.scss']
})
export class CommissionPagingComponent implements OnInit {

  constructor() { }

  inputPagingObj;
  ngOnInit() {
    this.inputPagingObj=new UcpagingModule();
    this.inputPagingObj._url="./assets/ucpaging/searchCommission.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;
    // this.inputPagingObj.deleteUrl = "/RefBank/DeleteRefBank";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchCommission.json";
  }

}
