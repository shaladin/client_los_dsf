import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { UCSearchModule } from "@adins/ucsearch";
import { UcpagingModule } from "@adins/ucpaging";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { RouterModule } from "@angular/router";
import { SharingModule } from 'app/shared/sharing.module';
import { ArchwizardModule } from 'angular-archwizard';
import { UcSubsectionModule } from "@adins/uc-subsection";
import { SharingComponentModule } from 'app/shared/sharingcomponent.module';
import { UcgridfooterModule, UcgridfooterComponent } from "@adins/ucgridfooter";



import { UcviewgenericModule } from "@adins/ucviewgeneric";
import { InvoiceDataAddComponent } from "./invoice-data-add/invoice-data-add.component";
import { InvoiceRoutingModule } from "./invoice-routing.module";



// import { ShowErrorsComponent } from "./app/test-new/show-errors.component";

@NgModule({
  imports: [

    CommonModule,
    FormsModule,
    HttpModule,
    UCSearchModule,
    UcgridfooterModule,
    UcpagingModule,
    NgbModule,
    SharingModule,
    ArchwizardModule,
    ReactiveFormsModule,
    UcSubsectionModule,
    SharingComponentModule,
    RouterModule,
    InvoiceRoutingModule,
    UcviewgenericModule,
  ],
  declarations: [
    InvoiceDataAddComponent
   
  ]
})
export class InvoiceModule { }