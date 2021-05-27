import { NgModule } from '@angular/core';
import { TaskReassignmentDetailComponent } from './task-reassignment/task-reassignment-detail/task-reassignment-detail.component';
import { TaskReassignmentComponent } from './task-reassignment/task-reassignment.component';
import { TaskReassignmentApprovalComponent } from './task-reassignment-approval/task-reassignment-approval.component';
import { TaskReassignmentApprovalDetailComponent } from './task-reassignment-approval/task-reassignment-approval-detail/task-reassignment-approval-detail.component';
import { RouterModule, Routes } from '@angular/router';
import { TaskReassigmnetViewComponent } from './task-reassigmnet-view/task-reassigmnet-view.component';
import { TaskReassigmnetInquiryComponent } from './task-reassigmnet-inquiry/task-reassigmnet-inquiry.component';
import { PathConstant } from 'app/shared/constant/PathConstant';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: PathConstant.PAGING,
                component: TaskReassignmentComponent,
                data: {
                    title: 'Task Reassignment Paging'
                }
            },
            {
                path: PathConstant.DETAIL,
                component: TaskReassignmentDetailComponent,
                data: {
                    title: 'Task Reassignment Detail'
                }
            },
            {
                path: PathConstant.TASK_REASSIGN_APV_PAGING,
                component: TaskReassignmentApprovalComponent,
                data: {
                    title: 'Task Reassignment Approval Paging'
                }
            },
            {
                path: PathConstant.TASK_REASSIGN_APV_DETAIL,
                component: TaskReassignmentApprovalDetailComponent,
                data: {
                    title: 'Task Reassignment Approval Detail'
                }
            },
            {
                path: PathConstant.VIEW,
                component: TaskReassigmnetViewComponent,
                data: {
                    title: 'Task Reassignment View'
                }
            },
            {
                path: PathConstant.INQUIRY,
                component: TaskReassigmnetInquiryComponent,
                data: {
                    title: 'Task Reassignment Inquiry'
                }
            }
        ]
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
  })
  export class TaskReassignmentRoutingModule { }