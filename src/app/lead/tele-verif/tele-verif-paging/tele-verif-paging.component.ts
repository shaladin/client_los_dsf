import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';

@Component({
  selector: 'app-tele-verif-paging',
  templateUrl: './tele-verif-paging.component.html'
})
export class TeleVerifPagingComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();

  constructor() { }

  ngOnInit() {
    this.inputPagingObj._url = "./assets/ucpaging/searchTeleVerif.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchTeleVerif.json";
  }

}
