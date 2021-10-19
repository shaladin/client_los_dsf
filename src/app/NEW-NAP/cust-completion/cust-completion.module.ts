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
import { CustCompletionOplDetailComponent } from './cust-completion-opl-detail/cust-completion-opl-detail.component';
import { CustCompletionOplDetailCompanyComponent } from './cust-completion-opl-detail/cust-completion-opl-detail-company/cust-completion-opl-detail-company.component';
import { CustCompletionOplDetailPersonalComponent } from './cust-completion-opl-detail/cust-completion-opl-detail-personal/cust-completion-opl-detail-personal.component';
import { InputNapComponentModule } from "../sharing-component/input-nap-component/input-nap-component.module";
import { ViewMainInfoComponentModule } from "../sharing-component/view-main-info-component/view-main-info-component.module";
import { AdInsSharedModule } from "app/components/adins-module/AdInsShared.Module";
import { SharedModule } from 'app/shared/shared.module';
import { CustCompletionDetailPersonalXComponent } from 'app/impl/NEW-NAP/cust-completion/cust-completion-detail-x/cust-completion-detail-personal/cust-completion-detail-personal-x.component';
import { CustCompletionDetailCompanyXComponent } from 'app/impl/NEW-NAP/cust-completion/cust-completion-detail-x/cust-completion-detail-company/cust-completion-detail-company-x.component';
import { CustCompletionDetailXComponent } from 'app/impl/NEW-NAP/cust-completion/cust-completion-detail-x/cust-completion-detail-x.component';


@NgModule({
    declarations: [
        CustCompletionPagingComponent,
        CustCompletionDetailComponent,
        CustCompletionDetailPersonalComponent,
        CustCompletionDetailCompanyComponent,
        CustCompletionOplDetailComponent,
        CustCompletionOplDetailCompanyComponent,
        CustCompletionOplDetailPersonalComponent,
        CustCompletionDetailPersonalXComponent,
        CustCompletionDetailCompanyXComponent,
        CustCompletionDetailXComponent
    ],
    imports: [
        CommonModule,
        AdInsModule,
        AdInsSharedModule,
        UcSubsectionModule,
        CustCompletionRoutingModule,
        CustCompletionComponentModule,
        MainDataComponentModule,
        InputNapComponentModule,
        ViewMainInfoComponentModule,
        SharedModule,
    ],
    exports: [],
    providers: [
        NGXToastrService
      ]
})

export class CustCompletionModule {
}
