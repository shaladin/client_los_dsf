import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NapViewRoutingModule } from "./nap-view-routing.module";
import { AgreementViewContainerComponent } from "./agreement-view-container/agreement-view-container.component";
import { ApplicationViewComponent } from "./application-view/application-view.component";
import { ViewMainInfoComponentModule } from "../sharing-component/view-main-info-component/view-main-info-component.module";
import { ViewAppComponentModule } from "../sharing-component/view-app-component/view-app-component.module";
import { ArchwizardModule } from "angular-archwizard";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
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
import { TabDeviationComponent } from "../business-process/credit-process/credit-investigation/component/tab-deviation/tab-deviation.component";
import { ViewFraudDetectionResultComponent } from "../business-process/credit-process/credit-investigation/component/view-fraud-detection-result/view-fraud-detection-result.component";
import { CreditProcessSharingModule } from "../business-process/credit-process/credit-process.module";
import { ViewSharingComponentModule } from "../sharing-component/view-app-component/view-sharing-component.module";
import { ViewAgrmntComponentModule } from "../sharing-component/view-agrmnt-component/view-agrmnt-component.module";

@NgModule({
  imports: [
    NapViewRoutingModule,
    CommonModule,
    ViewMainInfoComponentModule,
    ViewAppComponentModule,
    MatTabsModule,
    ArchwizardModule,
    NgbModule,
    CreditProcessSharingModule,
    ViewSharingComponentModule,
    ViewAgrmntComponentModule
  ],
  declarations: [
    AgreementViewContainerComponent,
    ApplicationViewComponent,
  ]
})
export class NapViewModule { }
