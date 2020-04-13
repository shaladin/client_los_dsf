import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tele-verif-detail',
  templateUrl: './tele-verif-detail.component.html',
  styleUrls: ['./tele-verif-detail.component.scss']
})
export class TeleVerifDetailComponent implements OnInit {
  viewTeleVerifMainInfo: any;
  isCustData: boolean;
  isLeadData: boolean;

  constructor() { }

  ngOnInit() {
    this.viewTeleVerifMainInfo = "./assets/ucviewgeneric/viewTeleVerifMainInfo.json";
  }

  EnterTab(type){
      this.isCustData = true;
      this.isLeadData = true;
    // if(type == "custData"){
    //   this.isCustData = true;
    //   this.isLeadData = false;
    // }
    // else if(type == "leadData"){
    //   this.isCustData = false;
    //   this.isLeadData = true;
    // }
  }
}
