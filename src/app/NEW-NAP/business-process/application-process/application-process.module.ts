import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ArchwizardModule } from "angular-archwizard";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { RouterModule } from "@angular/router";
import { MatCheckboxModule, MatRadioModule, MatSelectModule, MatTabsModule } from "@angular/material";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { UcapprovalModule } from "@adins/ucapproval";
import { UcapprovebyModule } from "@adins/ucapproveby";
import { ProcessComponentModule } from "app/NEW-NAP/sharing-component/process-component/process-component.module";
import { UcSubsectionModule } from "@adins/uc-subsection";
import { ViewSharingComponentModule } from "app/NEW-NAP/sharing-component/view-app-component/view-sharing-component.module";
import { UcviewgenericModule } from "@adins/ucviewgeneric";
import { NgxCurrencyModule, CurrencyMaskInputMode } from "ngx-currency";
import { ViewAppComponentModule } from "app/NEW-NAP/sharing-component/view-app-component/view-app-component.module";
import { ViewMainInfoComponentModule } from "app/NEW-NAP/sharing-component/view-main-info-component/view-main-info-component.module";
import { SharedModule } from "app/shared/shared.module";
import { CreditReviewComponentModule } from "app/NEW-NAP/sharing-component/credit-review-component/credit-review-component.module";;
import { UcapprovalHistoryModule } from "@adins/ucapproval-history";
import { UcapprovalcreateModule } from "@adins/ucapprovalcreate";
import { UcapprovalR3Module } from "@adins/ucapproval-r3";
import { UcapprovalgeneralinfoModule } from "@adins/ucapprovalgeneralinfo";
import { ApplicationReviewPagingComponent } from "./application-review/application-review-paging/application-review-paging.component";
import { ApplicationReviewDetailComponent } from "./application-review/application-review-detail/application-review-detail.component";
import { ApplicationProcessSharingRoutingModule } from "./application-process-routing.module";
import { ApplicationApprovalDetailComponent } from "./application-approval/application-approval-detail/application-approval-detail.component";
import { ApplicationApprovalPagingComponent } from "./application-approval/application-approval-paging/application-approval-paging.component";




export const customCurrencyMaskConfig = {
  align: "right",
  allowNegative: true,
  allowZero: true,
  decimal: ".",
  precision: 2,
  prefix: "",
  suffix: "",
  thousands: ",",
  nullable: false,
  inputMode: CurrencyMaskInputMode.NATURAL
};

@NgModule({
  exports: [
  ],
  imports: [
    CommonModule,
    ApplicationProcessSharingRoutingModule,
    AdInsModule,
    ProcessComponentModule,
    ArchwizardModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule,
    MatTabsModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSelectModule,
    UcapprovalModule,
    UcapprovebyModule,
    UcSubsectionModule ,
    ViewSharingComponentModule,
    UcviewgenericModule,
    ViewAppComponentModule,
    ViewMainInfoComponentModule,
    SharedModule,
    CreditReviewComponentModule,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
    UcapprovalcreateModule,
    UcapprovalHistoryModule,
    UcapprovalR3Module,
    UcapprovalgeneralinfoModule
  ],
  declarations: [
    ApplicationReviewPagingComponent,
    ApplicationReviewDetailComponent,
    ApplicationApprovalPagingComponent,
    ApplicationApprovalDetailComponent
  ],
  providers: [
    NGXToastrService
  ]
})
export class ApplicationProcessSharingModule { }
