import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { RFN4WRoutingModule } from "./rfn4w-routing.module";
import { RsvFundPagingComponent } from "./reserved-fund/reserved-fund-paging/reserved-fund-paging.component";
import { CommissionPagingComponent } from "./commission/commission-paging/commission-paging.component";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { PhoneVerificationPagingComponent } from './phone-verification/phone-verification-paging/phone-verification-paging.component';
import { PreGoLivePagingComponent } from "./pre-go-live/pre-go-live-paging/pre-go-live-paging.component";

@NgModule({
  imports: [
    CommonModule,
    RFN4WRoutingModule,
    AdInsModule
  ],
  declarations: [
    RsvFundPagingComponent,
    CommissionPagingComponent,
    PhoneVerificationPagingComponent,
    PreGoLivePagingComponent
  ],
  providers: [
    NGXToastrService
  ]
})
export class RFN4WModule { }