import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
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
    UcShowErrorsModule
  ],
  declarations: [
  PoExtensionPagingComponent,
  PoExtensionDetailComponent],
  providers: [
    NGXToastrService
  ]
})
export class AddProcessModule { }