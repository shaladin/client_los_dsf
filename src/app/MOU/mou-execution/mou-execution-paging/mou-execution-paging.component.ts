import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';

@Component({
  selector: 'app-mou-execution-paging',
  templateUrl: './mou-execution-paging.component.html',
  styleUrls: ['./mou-execution-paging.component.scss']
})
export class MouExecutionPagingComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  constructor() { }

  ngOnInit() {
    this.inputPagingObj._url = "./assets/ucpaging/mou/searchMouRequestForExec.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/mou/searchMouRequestForExec.json";
  }
}
