import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { ArchwizardModule } from "angular-archwizard";
import { InputNapComponentModule } from "app/NEW-NAP/sharing-component/input-nap-component/input-nap-component.module";
import { InputNapCF2WRoutingModule } from "./input-nap-routing.module";
import { AppComponent } from './app/app.component';
import { AppPagingComponent } from "./app-paging/app-paging.component";
import { AppAddFreeComponent } from "./app-add-free/app-add-free.component";
import { AppAddFixedComponent } from "./app-add-fixed/app-add-fixed.component";


@NgModule({
    imports: [
        CommonModule,
        InputNapCF2WRoutingModule,
        AdInsModule,
        InputNapComponentModule,
        ArchwizardModule,
    ],
    declarations: [ 
        AppComponent,
        AppPagingComponent,
        AppAddFreeComponent,
        AppAddFixedComponent
    ],
    providers: [
        NGXToastrService
    ]
})
export class InputNapCF2WModule { }