import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { UCSearchModule } from "@adins/ucsearch";
import { UcpagingModule } from "@adins/ucpaging";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { UcSubsectionModule } from "@adins/uc-subsection";
import { SharingComponentModule } from 'app/shared/sharingcomponent.module';
import { UcgridfooterModule } from "@adins/ucgridfooter";
import { InquiryRoutingComponent } from "./inquiry-routing.module";
import { AppInquiryPagingComponent } from "./app-inquiry/app-inquiry-paging.component";
import { PurchaseTrackingInquiryComponent } from './purchase-tracking-inquiry/purchase-tracking-inquiry.component';
import { AppInquiryPagingXComponent } from "app/impl/inquiry/app-inquiry/app-inquiry-paging-x/app-inquiry-paging-x.component";
import { AdInsSharedModule } from "app/components/adins-module/adIns-shared.module";

@NgModule({
  imports: [
    InquiryRoutingComponent,
    CommonModule,
    FormsModule,
    HttpModule,
    UCSearchModule,
    UcgridfooterModule,
    UcpagingModule,
    NgbModule,
    AdInsSharedModule,
    ReactiveFormsModule,
    UcSubsectionModule,
    SharingComponentModule
  ],
  declarations: [
    AppInquiryPagingComponent,
    PurchaseTrackingInquiryComponent,
    AppInquiryPagingXComponent
  ]
})
export class InquiryModule { }