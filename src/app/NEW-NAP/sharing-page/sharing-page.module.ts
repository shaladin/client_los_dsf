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
import { Nap1FromLeadPagingComponent } from './nap1-from-lead/nap1-from-lead-paging/nap1-from-lead-paging.component';
import { Nap1FromLeadDetailComponent } from './nap1-from-lead/nap1-from-lead-detail/nap1-from-lead-detail.component';
import { NapFromSimpleLeadComponent } from './nap-from-simple-lead/nap-from-simple-lead.component';
import { NapFromSimpleLeadDetailComponent } from './nap-from-simple-lead/nap-from-simple-lead-detail/nap-from-simple-lead-detail.component';
import { UclookupgenericComponent } from "@adins/uclookupgeneric";
import { NapFromSimpleLeadDetailDsfComponent } from "../DSF/sharing-page-dsf/nap-from-simple-lead-detail-dsf/nap-from-simple-lead-detail-dsf.component";
import { NapFromSimpleLeadDsfComponent } from "../DSF/sharing-page-dsf/nap-from-simple-lead-dsf/nap-from-simple-lead-dsf.component";
import { NapFromSimpleLeadDetailXComponent } from "app/impl/NEW-NAP/sharing-page/nap-from-simple-lead/nap-from-simple-lead-detail/nap-from-simple-lead-detail-x.component";
import { AdInsSharedModule } from "app/components/adins-module/AdInsShared.Module";

@NgModule({
  imports: [
    CommonModule,
    AdInsModule,
    AdInsSharedModule,
    ArchwizardModule,
    SharingPageRoutingModule
  ],
  declarations: [
    NapFromLeadPagingComponent,
    NapFromLeadDetailComponent,
    NapFromMouPagingComponent,
    NapFromMouDetailComponent,
    NapFromSimpleLeadComponent,
    NapFromSimpleLeadDetailComponent,
    Nap1FromLeadPagingComponent,
    Nap1FromLeadDetailComponent,
    NapFromSimpleLeadDsfComponent,
    NapFromSimpleLeadDetailDsfComponent,
    NapFromSimpleLeadDetailXComponent,
  ],
  providers: [
    NGXToastrService
  ],
  entryComponents: [UclookupgenericComponent]
})
export class SharingPageModule { }