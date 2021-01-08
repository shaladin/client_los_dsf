import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NapViewRoutingModule } from "./nap-view-routing.module";
import { AgreementViewContainerComponent } from "./agreement-view-container/agreement-view-container.component";
import { ApplicationViewComponent } from "./application-view/application-view.component";
import { ViewMainInfoComponentModule } from "../sharing-component/view-main-info-component/view-main-info-component.module";
import { ViewAppComponentModule } from "../sharing-component/view-app-component/view-app-component.module";
import { ArchwizardModule } from "angular-archwizard";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { MatTabsModule } from "@angular/material";
import { UcSubsectionModule } from "@adins/uc-subsection";
import { UcviewgenericModule } from "@adins/ucviewgeneric";
import { CreditProcessSharingModule } from "../business-process/credit-process/credit-process.module";
import { ViewSharingComponentModule } from "../sharing-component/view-app-component/view-sharing-component.module";
import { ViewAgrmntComponentModule } from "../sharing-component/view-agrmnt-component/view-agrmnt-component.module";
import { PurchaseOrderViewComponent } from "./purchase-order-view/purchase-order-view.component";
import { UcgridviewModule } from "@adins/ucgridview";
import { AppMainInfoComponent } from "../sharing-component/view-main-info-component/app-main-info/app-main-info.component";
import { SharedModule } from "app/shared/shared.module";

@NgModule({
  exports: [
  ],
  imports: [
    NapViewRoutingModule,
    CommonModule,
    ViewMainInfoComponentModule,
    ViewAppComponentModule,
    MatTabsModule,
    UcSubsectionModule,
    UcviewgenericModule,
    ArchwizardModule,
    NgbModule,
    CreditProcessSharingModule,
    ViewSharingComponentModule,
    ViewAgrmntComponentModule,
    UcgridviewModule,
    SharedModule
  ],
  declarations: [
    AgreementViewContainerComponent,
    ApplicationViewComponent,
    PurchaseOrderViewComponent
  ],
  entryComponents: [
    AppMainInfoComponent,
  ]
})
export class NapViewModule { }
