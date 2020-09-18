import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';

@Component({
  selector: 'app-view-survey-task-list',
  templateUrl: './view-survey-task-list.component.html'
})
export class ViewSurveyTaskListComponent implements OnInit {

  @Input() trxRefNo: string;
  @Input() mrSrvySourceCode : string;
  listSrvy: any;
  
  constructor(private http : HttpClient) { }

  ngOnInit() {
    this.getSurveyTask();
  }

  getSurveyTask(){
    var reqObj = {trxRefNo : this.trxRefNo, mrSurveySourceCode : this.mrSrvySourceCode}
    this.http.post(URLConstant.GetListSrvyTaskAndOrderByTrxNoAndMrSurveySourceCode, reqObj).subscribe(
      response => {
        this.listSrvy = (response[CommonConstant.ReturnObj]);
      }
    );
  }
}
