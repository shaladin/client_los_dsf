import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-view-survey',
  templateUrl: './view-survey.component.html',
  styleUrls: ['./view-survey.component.scss']
})
export class ViewSurveyComponent implements OnInit {

  readonly ViewCust: string = environment.FoundationR3Web + NavigationConstant.VIEW_FOU_CUST_PERSONAL_DETAIL;
  readonly ViewLink: string = environment.FoundationR3Web + NavigationConstant.VIEW_FOU_SRVY_TASK;

  @Input() AppNo: string;
  TaskList = new Array();

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.post(URLConstant.GetListSrvyTaskByRefNoForView,{TrxNo: this.AppNo}).subscribe(
      (response) => {
        this.TaskList = response[CommonConstant.ReturnObj];
      }
    )
  }

  customerView(CustId){
    AdInsHelper.OpenCustomerViewByCustId(CustId);
  }

  viewResult(SrvyTaskId){
    AdInsHelper.OpenSrvyTaskViewBySrvyTaskId(SrvyTaskId);
  }

}
