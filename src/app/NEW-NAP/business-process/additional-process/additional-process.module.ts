import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { AdditionalProcessSharingRoutingModule } from "./additional-process-routing.module";
import { TcSharingComponentModule } from "app/NEW-NAP/sharing-component/input-nap-component/tc-sharing-component.module"
import { PoExtensionPagingComponent } from "./po-extension/po-extension-paging/po-extension-paging.component";
import { PoExtensionDetailComponent } from "./po-extension/po-extension-detail/po-extension-detail.component";
import { OutstandingTcPagingComponent } from "./outstanding-tc/outstanding-tc-paging/outstanding-tc-paging.component";
import { OutstandingTcDetailComponent } from "./outstanding-tc/outstanding-tc-detail/outstanding-tc-detail.component";
import { ReturnHandlingPagingComponent } from "./return-handling/return-handling-paging/return-handling-paging.component";
import { ReturnHandlingDetailComponent } from "./return-handling/return-handling-detail/return-handling-detail.component";
import { ViewMainInfoComponentModule } from "app/NEW-NAP/sharing-component/view-main-info-component/view-main-info-component.module"
import { PagingComponent } from "./app-dup-check/paging/paging.component";
import { ListPersonalComponent } from "./app-dup-check/list-personal/list-personal.component";
import { ListCompanyComponent } from "./app-dup-check/list-company/list-company.component";
import { ApplicantExistingDataPersonalComponent } from "./app-dup-check/applicant-existing-data-personal/applicant-existing-data-personal.component";
import { ApplicantExistingDataCompanyComponent } from "./app-dup-check/applicant-existing-data-company/applicant-existing-data-company.component";
import { ReturnHandlingPhoneVerifPagingComponent } from "./return-handling/return-handling-phone-verif-paging/return-handling-phone-verif-paging.component";

@NgModule({
  imports: [
    CommonModule,
    AdditionalProcessSharingRoutingModule,
    AdInsModule,
    TcSharingComponentModule,
    ViewMainInfoComponentModule
  ],
  declarations: [
    PoExtensionPagingComponent,
    PoExtensionDetailComponent,
    OutstandingTcPagingComponent,
    OutstandingTcDetailComponent,
    ReturnHandlingPagingComponent,
    ReturnHandlingDetailComponent,
    PagingComponent,
    ListPersonalComponent,
    ListCompanyComponent,
    ApplicantExistingDataPersonalComponent,
    ApplicantExistingDataCompanyComponent,
    ReturnHandlingPhoneVerifPagingComponent
  ],
  providers: [
    NGXToastrService
  ]
})
export class AdditionalProcessSharingModule { }
