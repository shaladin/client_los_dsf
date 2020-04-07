import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule, FormGroupDirective } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { UCSearchModule } from "@adins/ucsearch";
import { UcpagingModule } from "@adins/ucpaging";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { PoExtensionPagingComponent } from './po-extension/po-extension-paging/po-extension-paging.component';
import { AddProcessRoutingModule } from "./add-process-routing.module";
import { PoExtensionDetailComponent } from './po-extension/po-extension-detail/po-extension-detail.component';
import { UcviewgenericModule } from "@adins/ucviewgeneric";
import { UcShowErrorsModule } from "@adins/uc-show-errors";
import { OutstandingTcPagingComponent } from './outstanding-tc/outstanding-tc-paging/outstanding-tc-paging.component';
import { OutstandingTcDetailComponent } from './outstanding-tc/outstanding-tc-detail/outstanding-tc-detail.component';
import { TermConditionsComponent } from "app/shared/components/term-conditions/term-conditions.component";
import { SharingComponentModule } from "app/shared/sharingcomponent.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    UCSearchModule,
    UcpagingModule,
    NgbModule,
    ReactiveFormsModule,
    AddProcessRoutingModule,
    UcviewgenericModule,
    UcShowErrorsModule,
    SharingComponentModule
  ],
  declarations: [
  PoExtensionPagingComponent,
  PoExtensionDetailComponent,
  OutstandingTcPagingComponent,
  OutstandingTcDetailComponent],
  providers: [
    NGXToastrService
  ]
})
export class AddProcessModule { }