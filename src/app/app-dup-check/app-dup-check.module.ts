import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { UCSearchModule } from "@adins/ucsearch";
import { UcpagingModule } from "@adins/ucpaging";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { UcSubsectionModule } from "@adins/uc-subsection";
import { SharingComponentModule } from 'app/shared/sharingcomponent.module';
import { UcgridfooterModule } from "@adins/ucgridfooter";
import { AppDupCheckRoutingComponent } from "./app-dup-check-routing.module";
import { PagingComponent } from "./paging/paging.component";
import { ListPersonalComponent } from "./list-personal/list-personal.component";
import { ListCompanyComponent } from "./list-company/list-company.component";
import { ApplicantExistingDataPersonalComponent } from './applicant-existing-data-personal/applicant-existing-data-personal.component';
import { ApplicantExistingDataCompanyComponent } from './applicant-existing-data-company/applicant-existing-data-company.component';

@NgModule({
    imports: [
        AppDupCheckRoutingComponent,
        CommonModule,
        FormsModule,
        HttpModule,
        UCSearchModule,
        UcgridfooterModule,
        UcpagingModule,
        NgbModule,
        ReactiveFormsModule,
        UcSubsectionModule,
        SharingComponentModule
    ],
    declarations: [
        PagingComponent,
        ListPersonalComponent,
        ListCompanyComponent,
        ApplicantExistingDataPersonalComponent,
        ApplicantExistingDataCompanyComponent
    ]
})
export class AppDupCheckModule {
}
