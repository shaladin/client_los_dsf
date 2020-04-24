import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { ArchwizardModule } from "angular-archwizard";
import { InputNapComponentModule } from "app/NEW-NAP/sharing-component/input-nap-component/input-nap-component.module";
import { InputNapCF2WRoutingModule } from "./input-nap-routing.module";
import { AppComponent } from './app/app.component';


@NgModule({
    imports: [
        CommonModule,
        InputNapCF2WRoutingModule,
        AdInsModule,
        InputNapComponentModule,
        ArchwizardModule,
    ],
    declarations: [ 
        AppComponent],
    providers: [
        NGXToastrService
    ]
})
export class InputNapCF2WModule { }