import { Component, OnInit } from '@angular/core';
import { ResponseTaskReassignmentDetailPageObj } from 'app/shared/model/TaskReassignment/ResponseTaskReassignmentDetailPageObj.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-task-reassigmnet-view',
  templateUrl: './task-reassigmnet-view.component.html'
})
export class TaskReassigmnetViewComponent implements OnInit {
  TaskReassignmentTrxId: number;
  TaskReassignmentObj: ResponseTaskReassignmentDetailPageObj = new ResponseTaskReassignmentDetailPageObj();

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute
  ) { 

    this.TaskReassignmentObj = new ResponseTaskReassignmentDetailPageObj();
    this.route.queryParams.subscribe(params => {

      if( params["TaskReassignmentTrxId"] !=null){ 
        this.TaskReassignmentTrxId = params["TaskReassignmentTrxId"];
      }
    });
  }

  ngOnInit() {
    let urlApi: string = environment.isCore ? URLConstant.GetTaskReassignmentDetailForApprovalV2 : URLConstant.GetTaskReassignmentDetailForApproval;
    this.http.post(urlApi, { TaskReassignmentTrxId: this.TaskReassignmentTrxId }).toPromise().then(
      (response: ResponseTaskReassignmentDetailPageObj) => {
        this.TaskReassignmentObj = response;
      }
    );
  }
}
