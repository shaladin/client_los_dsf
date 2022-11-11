import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LtkmRequestXComponent } from 'app/impl/ltkm/ltkm-request/ltkm-request-x.component';
import { LtkmReturnHandlingXComponent } from 'app/impl/ltkm/ltkm-return-handling/detail/ltkm-return-handling-x.component';
import { LtkmVerifyDetailXComponent } from 'app/impl/ltkm/ltkm-verify/detail/ltkm-verify-detail-x.component';
import { PathConstantX } from 'app/impl/shared/constant/PathConstantX';
import { PathConstant } from 'app/shared/constant/PathConstant';
import { LtkmApprovalDetailComponent } from './ltkm-approval/detail/ltkm-approval-detail.component';
import { LtkmApprovalPagingComponent } from './ltkm-approval/paging/ltkm-approval-paging.component';
import { LtkmInquiryComponent } from './ltkm-inquiry/ltkm-inquiry.component';
import { LtkmRequestComponent } from './ltkm-request/ltkm-request.component';
import { LtkmReturnHandlingComponent } from './ltkm-return-handling/detail/ltkm-return-handling.component';
import { LtkmReturnHandlingPagingComponent } from './ltkm-return-handling/paging/ltkm-return-handling.component';
import { LtkmVerifyDetailComponent } from './ltkm-verify/detail/ltkm-verify-detail.component';
import { LtkmVerifyPagingComponent } from './ltkm-verify/paging/ltkm-verify-paging.component';
import { LtkmViewComponent } from './view-ltkm-component/ltkm-view-component';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: PathConstant.REQ,
        component: LtkmRequestComponent,
        data: {
          title: 'LTKM Request'
        }
      },
      {
        path: PathConstantX.REQ_X,
        component: LtkmRequestXComponent,
        data: {
          title: 'LTKM Request X'
        }
      },
      {
        path: PathConstant.VERIFY_PAGING,
        component: LtkmVerifyPagingComponent,
        data: {
          title: 'LTKM Verify Paging'
        }
      },
      {
        path: PathConstant.VERIFY_DETAIL,
        component: LtkmVerifyDetailComponent,
        data: {
          title: 'LTKM Verify Detail'
        }
      },
      {
        path: PathConstantX.VERIFY_DETAIL,
        component: LtkmVerifyDetailXComponent,
        data: {
          title: 'LTKM Verify Detail X'
        }
      },
      {
        path: PathConstant.VERIFY_APV_PAGING,
        component: LtkmApprovalPagingComponent,
        data: {
          title: 'LTKM Verify Approval Paging'
        }
      },
      {
        path: PathConstant.VERIFY_APV_DETAIL,
        component: LtkmApprovalDetailComponent,
        data: {
          title: 'LTKM Verify Approval Detail'
        }
      },
      {
        path: PathConstant.RTN_HANDLING_PAGING,
        component: LtkmReturnHandlingPagingComponent,
        data: {
          title: 'LTKM Return Handling Paging'
        }
      },
      {
        path: PathConstant.RTN_HANDLING_DETAIL,
        component: LtkmReturnHandlingXComponent,
        data: {
          title: 'LTKM Return Handling Detail'
        }
      },
      {
        path: PathConstant.INQUIRY,
        component: LtkmInquiryComponent,
        data: {
          title: 'LTKM Inquiry'
        }
      },
      {
        path: PathConstant.VIEW,
        component: LtkmViewComponent,
        data: {
          title: 'LTKM View'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LtkmRoutingModule { }
