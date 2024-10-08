import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { MatCheckboxModule, MatTabsModule } from "@angular/material";
import { NgxCurrencyModule, CurrencyMaskInputMode } from "ngx-currency";
import { SharedModule } from "app/shared/shared.module";
import { TaskReassignmentComponent } from "./task-reassignment/task-reassignment.component";
import { TaskReassignmentDetailComponent } from "./task-reassignment/task-reassignment-detail/task-reassignment-detail.component";
import { TaskReassignmentApprovalComponent } from './task-reassignment-approval/task-reassignment-approval.component';
import { TaskReassignmentApprovalDetailComponent } from './task-reassignment-approval/task-reassignment-approval-detail/task-reassignment-approval-detail.component';
import { TaskReassignmentRoutingModule } from "./task-reassignment-routing.module";
import { UcapprovalcreateModule } from '@adins/ucapprovalcreate';
import { UcapprovalR3Module } from '@adins/ucapproval-r3';
import { UcapprovalHistoryModule } from "@adins/ucapproval-history";
import { UcapprovalgeneralinfoModule } from "@adins/ucapprovalgeneralinfo";
import { TaskReassigmnetViewComponent } from './task-reassigmnet-view/task-reassigmnet-view.component';
import { TaskReassigmnetInquiryComponent } from "./task-reassigmnet-inquiry/task-reassigmnet-inquiry.component";
import { AdInsSharedModule } from "app/components/adins-module/adIns-shared.module";
import { TaskReassignmentApprovalDetailXComponent } from "app/impl/task-reassignment/task-reassignment-approval/task-reassignment-approval-detail/task-reassignment-approval-detail/task-reassignment-approval-detail-x.component";

export const customCurrencyMaskConfig = {
  align: "right",
  allowNegative: false,
  allowZero: true,
  decimal: ".",
  precision: 0,
  prefix: "",
  suffix: "",
  thousands: ",",
  nullable: false,
  inputMode: CurrencyMaskInputMode.NATURAL
};

@NgModule({
  imports: [
    CommonModule,
    AdInsModule,
    AdInsSharedModule,
    MatCheckboxModule,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
    SharedModule,
    MatTabsModule,
    TaskReassignmentRoutingModule,
    UcapprovalcreateModule,
    UcapprovalR3Module,
    UcapprovalHistoryModule,
    UcapprovalgeneralinfoModule
  ],
  declarations: [
    TaskReassignmentComponent,
    TaskReassignmentDetailComponent,
    TaskReassignmentApprovalComponent,
    TaskReassignmentApprovalDetailComponent,
    TaskReassignmentApprovalDetailXComponent,
    TaskReassigmnetViewComponent,
    TaskReassigmnetInquiryComponent
  ],
  providers: [
    NGXToastrService
  ]
})
export class TaskReassignmentModule { }
