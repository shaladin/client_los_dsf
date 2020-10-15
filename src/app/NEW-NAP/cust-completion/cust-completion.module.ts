import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { UcSubsectionModule } from "@adins/uc-subsection";
import { CustCompletionPagingComponent } from "./cust-completion-paging/cust-completion-paging.component";
import { CustCompletionDetailComponent } from "./cust-completion-detail/cust-completion-detail.component";
import { CustCompletionRoutingModule } from "./cust-completion-routing.module";
import { CustCompletionComponentModule } from "../sharing-component/cust-completion-component/cust-completion-component.module";
import { CustCompletionDetailPersonalComponent } from './cust-completion-detail/cust-completion-detail-personal/cust-completion-detail-personal.component';
import { CustCompletionDetailCompanyComponent } from './cust-completion-detail/cust-completion-detail-company/cust-completion-detail-company.component';
import { MainDataComponentModule } from "../sharing-component/main-data-component/main-data-component.module";


@NgModule({
    declarations: [
        CustCompletionPagingComponent,
        CustCompletionDetailComponent,
        CustCompletionDetailPersonalComponent,
        CustCompletionDetailCompanyComponent
    ],
    imports: [
        CommonModule,
        AdInsModule,
        UcSubsectionModule,
        CustCompletionRoutingModule,
        CustCompletionComponentModule,
        MainDataComponentModule
    ],
    exports: [],
    providers: [
        NGXToastrService
      ]
})

export class CustCompletionModule { }