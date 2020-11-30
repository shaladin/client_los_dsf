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

@NgModule({
    imports: [
        CommonModule,
        UcSubsectionModule,
        UcviewgenericModule,
        UcgridviewModule
    ],
    declarations: [
        ViewAppCustDataCompanyComponent,
        ViewAppCustDataPersonalComponent,
        ViewAppCustDataCompletionPersonalComponent,
        ViewAppCustDataCompletionCompanyComponent,
        ViewAppCustDetailComponent,
        GuarantorComponent,
        GuarantorCompletionComponent,
    ],
    exports: [
        ViewAppCustDataCompanyComponent,
        ViewAppCustDataPersonalComponent,
        GuarantorComponent,
    ],
    entryComponents: [
        ViewAppCustDetailComponent
    ]
})
export class AppCustViewComponentsModule { }
