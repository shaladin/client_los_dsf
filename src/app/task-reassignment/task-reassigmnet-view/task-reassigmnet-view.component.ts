import { Component, OnInit } from '@angular/core';
import { ResponseTaskReassignmentDetailPageObj } from 'app/shared/model/TaskReassignment/ResponseTaskReassignmentDetailPageObj.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-task-reassigmnet-view',
  templateUrl: './task-reassigmnet-view.component.html'
})
export class TaskReassigmnetViewComponent implements OnInit {
  TaskReassignmentTrxId: number;
  TaskReassignmentObj: ResponseTaskReassignmentDetailPageObj;

  constructor(
    private router: Router,
    private http: HttpClient,
    private toastr: NGXToastrService,
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
    this.http.post(URLConstant.GetTaskReassignmentDetailForApproval, { TaskReassignmentTrxId: this.TaskReassignmentTrxId }).toPromise().then(
      (response: ResponseTaskReassignmentDetailPageObj) => {
        this.TaskReassignmentObj = response;
      }
    );
  }
}
