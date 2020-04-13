import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { FCTRRoutingModule } from "./fctr-routing.module";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { NapPagingComponent } from './new-application/nap-paging/nap-paging.component';
import { NapAddComponent } from './new-application/nap-add/nap-add.component';
import { NapAddDetailComponent } from './new-application/nap-add-detail/nap-add-detail.component';
import { ArchwizardModule } from "angular-archwizard";
import { PreGoLivePagingComponent } from "./pre-go-live-paging/pre-go-live-paging.component";

@NgModule({
  imports: [
    CommonModule,
    FCTRRoutingModule,
    AdInsModule,
    ArchwizardModule
  ],
  declarations: [
    NapPagingComponent,
    NapAddComponent,
    NapAddDetailComponent,
    PreGoLivePagingComponent
  ],
  providers: [
    NGXToastrService
  ]
})
export class FCTRModule { }