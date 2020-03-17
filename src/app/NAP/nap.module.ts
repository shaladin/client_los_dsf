import { AppAddComponent } from "./app-add/app-add.component";
import { AppPagingComponent } from "./app-paging/app-paging.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ArchwizardModule } from "angular-archwizard";
import { UcpagingModule } from "@adins/ucpaging";
import { UcviewgenericModule } from "@adins/ucviewgeneric";
import { UclookupgenericModule } from "@adins/uclookupgeneric";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { NapRoutingModule } from "./nap-routing.module";
import { RouterModule } from "@angular/router";
import { AppAddDetailComponent } from './app-add-detail/app-add-detail.component';
import { AppReferantorComponent } from './App-Referantor/app-referantor/app-referantor.component';
import { MatCheckboxModule } from "@angular/material";
import { CustomerDataComponent } from "./nap-tab/customer-data/customer-data.component";
import { MatRadioModule } from "@angular/material";
import { UcSubsectionModule } from "@adins/uc-subsection";
import { UcaddressModule } from "@adins/ucaddress";
import { SharingComponentModule } from "app/shared/sharingcomponent.module";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { MainDataComponent } from "./nap-tab/customer-data/component/main-data/main-data.component";
import { CustUcaddressComponent } from "./nap-tab/customer-data/component/address/ucaddress.component";



@NgModule({
    declarations: [
        AppAddComponent,
        AppPagingComponent,
        AppAddDetailComponent,
        AppReferantorComponent,
        CustomerDataComponent,
        MainDataComponent,
        CustUcaddressComponent
        ],
    imports: [ 
        NapRoutingModule,
        CommonModule,
        ArchwizardModule,
        UcpagingModule,
        UcviewgenericModule,
        UclookupgenericModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        CommonModule,
        RouterModule,
        MatCheckboxModule,
        MatRadioModule,
        UcSubsectionModule,
        SharingComponentModule,
        UcaddressModule
    ],
    exports: [],
    providers: [NGXToastrService],
})

export class NapModule { }