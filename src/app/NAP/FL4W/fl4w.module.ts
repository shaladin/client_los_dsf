import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { FL4WRoutingModule } from "./fl4w-routing.module";
import { DummyComponent } from './dummy/dummy.component';
import { AdInsModule } from "app/components/adins-module/adins.module";

@NgModule({
  imports: [
    CommonModule,
    FL4WRoutingModule,
    AdInsModule
  ],
  declarations: [
    DummyComponent
  ],
  providers: [
    NGXToastrService
  ]
})
export class FL4WModule { }