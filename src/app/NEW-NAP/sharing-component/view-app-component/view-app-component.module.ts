import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { InvoiceDataFctrComponent } from './invoice-data-fctr/invoice-data-fctr.component';

@NgModule({
  exports: [

  ],
  imports: [
    CommonModule,
    AdInsModule
  ],
  declarations: [
    InvoiceDataFctrComponent],
  providers: [
    NGXToastrService
  ]
})
export class ViewAppComponentModule { }