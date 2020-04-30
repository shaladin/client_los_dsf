import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';

@Component({
  selector: 'app-return-handling-survey',
  templateUrl: './return-handling-survey.component.html',
  styleUrls: []
})
export class ReturnHandlingSurveyComponent implements OnInit {

  constructor() { }
  TrxNo : any;
  TrxType : any = "APP";
  Token : any = localStorage.getItem("Token");
  inputPagingObj;
  ngOnInit() {
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url="./assets/ucpaging/searchReturnHandlingSurvey.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchReturnHandlingSurvey.json";
  }

  event(ev){
    console.log(ev);
    this.TrxNo = ev.AppNo;
  }

}
