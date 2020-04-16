import { Component, OnInit } from '@angular/core';
import { UcpagingModule } from '@adins/ucpaging';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';

@Component({
  selector: 'app-agrmnt-activation-paging',
  templateUrl: './agrmnt-activation-paging.component.html',
  styleUrls: ['./agrmnt-activation-paging.component.scss']
})
export class AgrmntActivationPagingComponent implements OnInit {
  inputPagingObj: any;
  constructor() { }

  ngOnInit() {
    this.inputPagingObj = new UcpagingModule();
    this.inputPagingObj._url = "./assets/ucpaging/searchAgrmntActivation.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchAgrmntActivation.json";
  }

}
