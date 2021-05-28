import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-task-reassignment',
  templateUrl: './task-reassignment.component.html',
  styles: []
})
export class TaskReassignmentComponent implements OnInit {
  InputPagingObj: UcPagingObj;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) { 
    this.InputPagingObj = new UcPagingObj();
    this.InputPagingObj._url="./assets/ucpaging/searchTaskReassignmentPaging.json";
    this.InputPagingObj.enviromentUrl = environment.losUrl;
    this.InputPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;
    this.InputPagingObj.pagingJson = "./assets/ucpaging/searchTaskReassignmentPaging.json";
    this.InputPagingObj.ddlEnvironments = [
      {
        name: "T.ACT_CODE",
        environment: environment.losUrl
      },
      {
        name: "T.OFFICE_CODE",
        environment: environment.FoundationR3Url
      }
    ];
  }

  ngOnInit() {
  }

}
