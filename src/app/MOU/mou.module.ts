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
// import { ShowErrorsComponent } from "./app/test-new/show-errors.component";

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
    SharingComponentModule
  ],
  declarations: [
    DocSignerComponent
  ]
})
export class MouModule { }