import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NapRoutingModule } from "./nap-routing.module";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { MatRadioModule } from "@angular/material";
import { UcSubsectionModule } from "@adins/uc-subsection";
import { ViewAppComponentModule } from "app/NEW-NAP/sharing-component/view-app-component/view-app-component.module";
import { SharedModule } from "app/shared/shared.module";
import { AdInsSharedModule } from "app/components/adins-module/adIns-shared.module";
import { UcpagingComponent } from "@adins/ucpaging";
import { PreGoLiveApprovalDetailDsfComponent } from './DSF/business-process-dsf/admin-process-dsf/pre-go-live/pre-go-live-approval-detail-dsf/pre-go-live-approval-detail-dsf.component';
import { PreGoLiveApprovalPagingXDsfComponent } from './DSF/business-process-dsf/admin-process-dsf/pre-go-live-x/pre-go-live-approval-paging-x-dsf/pre-go-live-approval-paging-x-dsf.component';
import { ApplicationAgreementCancellationPagingDsfComponent } from './DSF/business-process-dsf/admin-process-dsf/application-agreement-cancellation-dsf/application-agreement-cancellation-paging-dsf/application-agreement-cancellation-paging-dsf.component';
import { ApplicationAgreementCancellationDetailXDsfComponent } from './DSF/business-process-dsf/admin-process-dsf/application-agreement-cancellation-x-dsf/application-agreement-cancellation-detail-x-dsf/application-agreement-cancellation-detail-x-dsf.component';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        MatRadioModule,
        NapRoutingModule,
        AdInsModule,
        AdInsSharedModule,
        UcSubsectionModule,
        ViewAppComponentModule,
        SharedModule
    ],
    exports: [],
    entryComponents: [
        UcpagingComponent
    ],
    providers: [
        NGXToastrService
      ]
})

export class NapModule { }
