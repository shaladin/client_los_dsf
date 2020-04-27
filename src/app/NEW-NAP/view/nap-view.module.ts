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

@NgModule({
  imports: [
    NapViewRoutingModule,
    CommonModule,
    MatTabsModule,
    UcSubsectionModule
  ],
  declarations: [
    AgreementViewContainerComponent,
    applicationViewComponent,
    TabReferantorComponent,
    InvoiceViewComponent,
    TabCommissionComponent,
    ListDataCommissionComponent
  ]
})
export class NapViewModule { }