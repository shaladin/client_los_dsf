import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { SharedModule } from "app/shared/shared.module";
import { SharingModule } from "app/shared/sharing.module";
import { SharingComponentModule } from "app/shared/sharingcomponent.module";
import { UnauthorizedPageComponent } from "./unauthorized.component";

@NgModule({
    imports: [
      RouterModule,
      AdInsModule,
      SharingModule,
      ReactiveFormsModule,
      SharingComponentModule,
      SharedModule
    ],
    declarations: [
        UnauthorizedPageComponent
    ],
    exports: [],
    providers: [NGXToastrService],
    entryComponents: [
    ]
  })
  
  export class UnauthorizedModule { }