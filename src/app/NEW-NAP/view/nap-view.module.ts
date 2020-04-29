import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NapViewRoutingModule } from "./nap-view-routing.module";
import { AgreementViewContainerComponent } from "./agreement-view-container/agreement-view-container.component";
import { ApplicationViewComponent } from "./application-view/application-view.component";
import { ViewMainInfoComponentModule } from "../sharing-component/view-main-info-component/view-main-info-component.module";
import { ViewAppComponentModule } from "../sharing-component/view-app-component/view-app-component.module";
import { MatTabsModule } from "@angular/material";
import { ArchwizardModule } from "angular-archwizard";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";


@NgModule({
  imports: [
    NapViewRoutingModule,
    CommonModule,
    ViewMainInfoComponentModule,
    ViewAppComponentModule,
    MatTabsModule,
    ArchwizardModule,
    NgbModule
  ],
  declarations: [
    AgreementViewContainerComponent,
    ApplicationViewComponent
  ]
})
export class NapViewModule { }