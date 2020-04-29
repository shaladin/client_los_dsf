import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NapViewRoutingModule } from "./nap-view-routing.module";
import { AgreementViewContainerComponent } from "./agreement-view-container/agreement-view-container.component";
import { applicationViewComponent } from "./application-view/application-view.component";
import { TabReferantorComponent } from "../sharing-component/view-app-component/tab-referantor/tab-referantor.component";
import { TabCommissionComponent } from "../sharing-component/view-app-component/tab-commission/tab-commission.component";
import { MatTabsModule } from "@angular/material";
import { InvoiceViewComponent } from "../business-process/admin-process/invoice/invoice-view/invoice-view.component";
import { UcSubsectionModule } from "@adins/uc-subsection";
import { ListDataCommissionComponent } from "../sharing-component/view-app-component/tab-commission/list-data-commission/list-data-commission.component";
import { ViewReservedFundComponent } from "../sharing-component/view-app-component/view-reserved-fund/view-reserved-fund.component";
import { ViewPhoneVerifComponent } from "../sharing-component/view-app-component/view-phone-verif/view-phone-verif.component";
import { ViewAssetDataComponent } from "../sharing-component/view-app-component/view-asset-data/view-asset-data.component";
import { TabApplicationComponent } from "../sharing-component/view-app-component/tab-application/tab-application.component";
import { UcviewgenericModule } from "@adins/ucviewgeneric";
import { TabAnalysisResultComponent } from "../sharing-component/view-app-component/tab-analysis-result/tab-analysis-result.component";

@NgModule({
  imports: [
    NapViewRoutingModule,
    CommonModule,
    MatTabsModule,
    UcSubsectionModule,
    UcviewgenericModule
  ],
  declarations: [
    AgreementViewContainerComponent,
    applicationViewComponent,
    TabReferantorComponent,
    TabCommissionComponent,
    ListDataCommissionComponent,
    ViewReservedFundComponent,
    ViewPhoneVerifComponent,
    ViewAssetDataComponent,
    TabApplicationComponent,
    TabAnalysisResultComponent,
    InvoiceViewComponent
  ]
})
export class NapViewModule { }
