import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';

@Component({
  selector: 'app-doc-pickup-request-paging',
  templateUrl: './doc-pickup-request-paging.component.html',
  styleUrls: ['./doc-pickup-request-paging.component.scss']
})
export class DocPickupRequestPagingComponent implements OnInit {

  inputPagingObj: UcPagingObj = new UcPagingObj();

  constructor() { }

  ngOnInit() {   
    this.inputPagingObj._url = "./assets/ucpaging/searchDocPickupRequest.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchDocPickupRequest.json"; 
  }

}
