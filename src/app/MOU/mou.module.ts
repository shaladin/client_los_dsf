import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { UCSearchModule } from "@adins/ucsearch";
import { UcpagingModule } from "@adins/ucpaging";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { RouterModule } from "@angular/router";
import { UcSubsectionModule } from "@adins/uc-subsection";
import { SharingComponentModule } from 'app/shared/sharingcomponent.module';
import { UcgridfooterModule, UcgridfooterComponent } from "@adins/ucgridfooter";
import { MouRoutingComponent } from "./mou-routing.module";
import { DocSignerComponent } from "./doc-signer/doc-signer.component";
import { CustomerDocPrintingDetailComponent } from "./customer-doc-printing/customer-doc-printing-detail/customer-doc-printing-detail.component";
import { CustomerDocPrintingPagingComponent } from "./customer-doc-printing/customer-doc-printing-paging/customer-doc-printing-paging.component";
// import { ShowErrorsComponent } from "./app/test-new/show-errors.component";
import { UcviewgenericModule } from "@adins/ucviewgeneric";
@NgModule({
  imports: [
    MouRoutingComponent,
    CommonModule,
    FormsModule,
    HttpModule,
    UCSearchModule,
    UcgridfooterModule,
    UcpagingModule,
    NgbModule,
    ReactiveFormsModule,
    UcSubsectionModule,
    SharingComponentModule,
    UcgridfooterModule,
    UcviewgenericModule
  ],
  declarations: [
    DocSignerComponent,
    CustomerDocPrintingDetailComponent,
    CustomerDocPrintingPagingComponent
  ]
})
export class MouModule { }