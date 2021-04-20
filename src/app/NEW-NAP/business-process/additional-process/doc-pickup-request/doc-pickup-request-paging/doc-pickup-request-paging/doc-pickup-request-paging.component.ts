import { Component, OnInit } from '@angular/core';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-doc-pickup-request-paging',
  templateUrl: './doc-pickup-request-paging.component.html',
  styleUrls: ['./doc-pickup-request-paging.component.scss']
})
export class DocPickupRequestPagingComponent implements OnInit {

  inputPagingObj: UcPagingObj = new UcPagingObj();

  constructor() { }

  ngOnInit() {   
    
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/searchDocPickupRequest.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchDocPickupRequest.json"; 
    this.inputPagingObj.ddlEnvironments = [
      {
        name: "ROL.OFFICE_CODE",
        environment: environment.losUrl
      },
      {
        name: "A.APP_CURR_STEP",
        environment: environment.losUrl
      }
    ]
    
  }

}
