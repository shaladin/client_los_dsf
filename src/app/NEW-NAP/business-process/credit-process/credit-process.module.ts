import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { CreditProcessSharingRoutingModule } from "./credit-process-routing.module";
import { RsvFundPagingComponent } from "./reserved-fund/reserved-fund-paging/reserved-fund-paging.component";
import { PhoneVerificationPagingComponent } from "./phone-verification/phone-verification-paging/phone-verification-paging.component";
import { CommissionPagingComponent } from "./commission/commission-paging/commission-paging.component";

@NgModule({
  imports: [
    CommonModule,
    CreditProcessSharingRoutingModule,
    AdInsModule,
  ],
  declarations: [
    RsvFundPagingComponent,
    CommissionPagingComponent,
    PhoneVerificationPagingComponent,
  ],
  providers: [
    NGXToastrService
  ]
})
export class CreditProcessSharingModule { }