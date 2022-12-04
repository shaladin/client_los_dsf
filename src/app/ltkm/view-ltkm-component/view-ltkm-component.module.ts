import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { UcviewgenericModule } from "@adins/ucviewgeneric";
import { UcSubsectionModule } from "@adins/uc-subsection";
import { UcapprovalhistModule  } from '@adins/ucapprovalhist';
import { LtkmApprovalHistComponent } from "./ltkm-approval-history-data/ltkm-approval-history-data.component";
import { ViewLtkmCustHistoryDataComponent } from "./ltkm-customer-history-data/ltkm-customer-history-data.component";
import { ViewLtkmSummaryDataComponent } from "./ltkm-summary-data/ltkm-summary-data.component";
import { ViewLtkmCustDataCompanyComponent } from "./ltkm-customer-data/ltkm-customer-data-company/view-ltkm-customer-data-company.component";
import { ViewLtkmCustDataCompletionCompanyComponent } from "./ltkm-customer-data/ltkm-customer-data-company/view-ltkm-cust-data-completion-company.component";
import { ViewLtkmCustDataPersonalDataComponent } from "./ltkm-customer-data/ltkm-customer-data-personal/view-ltkm-customer-data-personal.component";
import { ViewLtkmCustDataCompletionPersonalComponent } from "./ltkm-customer-data/ltkm-customer-data-personal/view-ltkm-cust-data-completion-personal.component";
import { ViewLtkmCustDetailComponent } from "./ltkm-customer-data/view-ltkm-cust-detail/view-ltkm-cust-detail.component";
import { LtkmViewComponent } from "./ltkm-view-component";
import { MatTabsModule } from "@angular/material";
import { UcapprovalHistoryModule } from "@adins/ucapproval-history";
import { ViewLtkmAppSummaryDataComponent } from "./ltkm-app-summary-data/ltkm-app-summary-data.component";
import { AdInsSharedModule } from "app/components/adins-module/adIns-shared.module";
import { ViewLtkmCustDataCompletionCompanyXComponent } from "app/impl/ltkm/view-ltkm-component/ltkm-customer-data/ltkm-customer-data-company/view-ltkm-cust-data-completion-company-x.component";
import { ViewLtkmCustomerDataCompanyXComponent } from "app/impl/ltkm/view-ltkm-component/ltkm-customer-data/ltkm-customer-data-company/view-ltkm-customer-data-company-x.component";
import { ViewLtkmCustDetailXComponent } from "app/impl/ltkm/view-ltkm-component/ltkm-customer-data/view-ltkm-cust-detail/view-ltkm-cust-detail-x.component";
import { ViewLtkmCustDataCompletionPersonalXComponent } from "app/impl/ltkm/view-ltkm-component/ltkm-customer-data/ltkm-customer-data-personal/view-ltkm-cust-data-completion-personal-x.component";
import { ViewLtkmCustDataPersonalDataXComponent } from "app/impl/ltkm/view-ltkm-component/ltkm-customer-data/ltkm-customer-data-personal/view-ltkm-customer-data-personal-x.component";
import { LtkmViewComponentX } from "app/impl/ltkm/view-ltkm-component/ltkm-view-component-x";

@NgModule({
  exports: [
    //Ltkm view
    LtkmApprovalHistComponent,
    ViewLtkmCustHistoryDataComponent,
    ViewLtkmSummaryDataComponent,
    ViewLtkmCustDataCompanyComponent,
    ViewLtkmCustDataCompletionCompanyComponent,
    ViewLtkmCustDataPersonalDataComponent,
    ViewLtkmCustDataPersonalDataXComponent,
    ViewLtkmCustDataCompletionPersonalComponent,
    ViewLtkmCustDataCompletionPersonalXComponent,
    ViewLtkmCustDetailComponent,
    ViewLtkmAppSummaryDataComponent,
    LtkmViewComponent,
    ViewLtkmCustDataCompletionCompanyXComponent,
    ViewLtkmCustomerDataCompanyXComponent,
    ViewLtkmCustDetailXComponent,
    LtkmViewComponentX
  ],
  imports: [
    CommonModule,
    AdInsModule,
    UcviewgenericModule,
    UcSubsectionModule,
    UcapprovalhistModule,
    MatTabsModule,
    AdInsSharedModule,
    UcapprovalHistoryModule
  ],
  declarations: [
    //Ltkm view
    LtkmApprovalHistComponent,
    ViewLtkmCustHistoryDataComponent,
    ViewLtkmSummaryDataComponent,
    ViewLtkmCustDataCompanyComponent,
    ViewLtkmCustDataCompletionCompanyComponent,
    ViewLtkmCustDataPersonalDataComponent,
    ViewLtkmCustDataPersonalDataXComponent,
    ViewLtkmCustDataCompletionPersonalComponent,
    ViewLtkmCustDataCompletionPersonalXComponent,
    ViewLtkmCustDetailComponent,
    ViewLtkmAppSummaryDataComponent,
    LtkmViewComponent,
    ViewLtkmCustDataCompletionCompanyXComponent,
    ViewLtkmCustomerDataCompanyXComponent,
    ViewLtkmCustDetailXComponent,
    LtkmViewComponentX
  ],
  providers: [
    NGXToastrService
  ],
  entryComponents: [

  ]
})
export class ViewLtkmComponentModule { }
