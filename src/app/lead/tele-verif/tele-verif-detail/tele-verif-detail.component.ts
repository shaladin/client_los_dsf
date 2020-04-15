import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tele-verif-detail',
  templateUrl: './tele-verif-detail.component.html',
  styleUrls: ['./tele-verif-detail.component.scss']
})
export class TeleVerifDetailComponent implements OnInit {
  viewTeleVerifMainInfo: any;
  isCustData: boolean;
  isLeadData: boolean;
  WfTaskListId: any;

  constructor(private http: HttpClient, private route: ActivatedRoute) { 
    this.route.queryParams.subscribe(params => {
      this.WfTaskListId = params["WfTaskListId"];
    })
  }

  ngOnInit() {
    this.viewTeleVerifMainInfo = "./assets/ucviewgeneric/viewTeleVerifMainInfo.json";
  }

  EnterTab(type){
      // this.isCustData = true;
      // this.isLeadData = true;
    if(type == "custData"){
      this.isCustData = true;
      this.isLeadData = false;
    }
    else if(type == "leadData"){
      this.isCustData = false;
      this.isLeadData = true;
    }
  }
}
