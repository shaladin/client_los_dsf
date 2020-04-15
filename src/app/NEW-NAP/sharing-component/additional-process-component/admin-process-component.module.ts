import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { PoExtensionPagingComponent } from "./po-extension/po-extension-paging/po-extension-paging.component";
import { PoExtensionDetailComponent } from "./po-extension/po-extension-detail/po-extension-detail.component";
import { OutstandingTcPagingComponent } from "./outstanding-tc/outstanding-tc-paging/outstanding-tc-paging.component";
import { OutstandingTcDetailComponent } from "./outstanding-tc/outstanding-tc-detail/outstanding-tc-detail.component";

@NgModule({
  exports: [
    PoExtensionPagingComponent,
    PoExtensionDetailComponent,
    OutstandingTcPagingComponent,
    OutstandingTcDetailComponent
  ],
  imports: [
    CommonModule,
    AdInsModule
  ],
  declarations: [
    PoExtensionPagingComponent,
    PoExtensionDetailComponent,
    OutstandingTcPagingComponent,
    OutstandingTcDetailComponent
  ],
  providers: [
    NGXToastrService
  ]
})
export class AdditionalProcessComponentModule { }