import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NapViewRoutingModule } from "./nap-view-routing.module";
import { AgreementViewContainerComponent } from "./agreement-view-container/agreement-view-container.component";

@NgModule({
  imports: [
    NapViewRoutingModule,
    CommonModule,
  ],
  declarations: [
    AgreementViewContainerComponent
  ]
})
export class NapViewModule { }