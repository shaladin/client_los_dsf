import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { SharingPageRoutingModule } from "./sharing-page-routing.module";
import { ArchwizardModule } from "angular-archwizard";
import { NapFromLeadPagingComponent } from "./nap-from-lead/paging/nap-from-lead-paging.component";
import { NapFromLeadDetailComponent } from "./nap-from-lead/detail/nap-from-lead-detail.component";
import { NapFromMouPagingComponent } from './nap-from-mou/nap-from-mou-paging/nap-from-mou-paging.component';
import { NapFromMouDetailComponent } from './nap-from-mou/nap-from-mou-detail/nap-from-mou-detail.component';

@NgModule({
  imports: [
    CommonModule,
    AdInsModule,
    ArchwizardModule,
    SharingPageRoutingModule
  ],
  declarations: [
    NapFromLeadPagingComponent,
    NapFromLeadDetailComponent,
    NapFromMouPagingComponent,
    NapFromMouDetailComponent
  ],
  providers: [
    NGXToastrService
  ]
})
export class SharingPageModule { }