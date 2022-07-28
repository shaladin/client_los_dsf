import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { UcSubsectionModule } from '@adins/uc-subsection';
import { UcviewgenericModule } from '@adins/ucviewgeneric';
import { UcgridviewModule } from '@adins/ucgridview';
import { ViewAppCustDataCompanyComponent } from './view-app-cust-data-company/view-app-cust-data-company.component';
import { ViewAppCustDataPersonalComponent } from './view-app-cust-data-personal/view-app-cust-data-personal.component';
import { ViewAppCustDataCompletionPersonalComponent } from './view-app-cust-data-personal/view-app-cust-data-completion-personal.component';
import { ViewAppCustDataCompletionCompanyComponent } from './view-app-cust-data-company/view-app-cust-data-completion-company.component';
import { ViewAppCustDetailComponent } from './view-app-cust-detail/view-app-cust-detail.component';
import { GuarantorCompletionComponent } from './view-guarantor/view-guarantor-completion.component';
import { GuarantorComponent } from './view-guarantor/view-guarantor.component';
import { AdInsSharedModule } from 'app/components/adins-module/adIns-shared.module';
import { ViewAppCustDataCompanyXComponent } from 'app/impl/components/general/app-cust-view/view-app-cust-data-company/view-app-cust-data-company-x.component';
import { ViewAppCustDataCompletionCompanyXComponent } from 'app/impl/components/general/app-cust-view/view-app-cust-data-company/view-app-cust-data-completion-company-x.component';
import { ViewAppCustDataPersonalXComponent } from 'app/impl/components/general/app-cust-view/view-app-cust-data-personal/view-app-cust-data-personal-x.component';
import { ViewAppCustDataCompletionPersonalXComponent } from 'app/impl/components/general/app-cust-view/view-app-cust-data-personal/view-app-cust-data-completion-personal-x.component';

@NgModule({
    imports: [
        CommonModule,
        UcSubsectionModule,
        UcviewgenericModule,
        UcgridviewModule,
        AdInsSharedModule
    ],
    declarations: [
        ViewAppCustDataCompanyComponent,
        ViewAppCustDataCompanyXComponent,
        ViewAppCustDataPersonalComponent,
        ViewAppCustDataPersonalXComponent,
        ViewAppCustDataCompletionPersonalComponent,
        ViewAppCustDataCompletionPersonalXComponent,
        ViewAppCustDataCompletionCompanyComponent,
        ViewAppCustDataCompletionCompanyXComponent,
        ViewAppCustDetailComponent,
        GuarantorComponent,
        GuarantorCompletionComponent,
    ],
    exports: [
        ViewAppCustDataCompanyComponent,
        ViewAppCustDataCompanyXComponent,
        ViewAppCustDataPersonalComponent,
        ViewAppCustDataPersonalXComponent,
        GuarantorComponent,
    ],
    entryComponents: [
        ViewAppCustDetailComponent
    ]
})
export class AppCustViewComponentsModule { }
