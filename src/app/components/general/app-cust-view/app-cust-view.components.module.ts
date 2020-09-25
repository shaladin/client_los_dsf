import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { UcSubsectionModule } from '@adins/uc-subsection';
import { UcviewgenericModule } from '@adins/ucviewgeneric';
import { UcgridviewModule } from '@adins/ucgridview';
import { ViewAppCustDataCompanyComponent } from './view-app-cust-data-company/view-app-cust-data-company.component';
import { ViewAppCustDataPersonalComponent } from './view-app-cust-data-personal/view-app-cust-data-personal.component';

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
    ],
    exports: [
        ViewAppCustDataCompanyComponent,
        ViewAppCustDataPersonalComponent,
    ]
})
export class AppCustViewComponentsModule { }
