import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { UCSearchModule } from "@adins/ucsearch";
import { UcpagingModule } from "@adins/ucpaging";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { SharingModule } from 'app/shared/sharing.module';
import { ArchwizardModule } from 'angular-archwizard';
import { UcSubsectionModule } from "@adins/uc-subsection";
import { SharingComponentModule } from 'app/shared/sharingcomponent.module';
import { UcgridfooterModule } from "@adins/ucgridfooter";
import { UclookupgenericComponent, UclookupgenericModule } from "@adins/uclookupgeneric";
import { UcviewgenericComponent, UcviewgenericModule } from "@adins/ucviewgeneric";
import { UcgridviewModule, UcgridviewComponent } from "@adins/ucgridview";
import { UcapprovalhistModule, UcapprovalhistComponent } from "@adins/ucapprovalhist";
import { UcShowErrorsModule } from "@adins/uc-show-errors";
import { AppCustViewComponentsModule } from "app/components/general/app-cust-view/app-cust-view.components.module";
import { AppViewComponentsModule } from "app/components/general/app-view/app-view.components.module";
import { SharedModule } from "app/shared/shared.module";
import { AppListViewRoutingModule } from "./app-list-view-routing.module";
import { AppListViewComponent } from "./app-list-view.component";

@NgModule({
    imports: [
        AppListViewRoutingModule,
        CommonModule,
        FormsModule,
        HttpModule,
        UCSearchModule,
        UcgridfooterModule,
        UcpagingModule,
        UclookupgenericModule,
        UcviewgenericModule,
        UcgridviewModule,
        NgbModule,
        SharingModule,
        ArchwizardModule,
        ReactiveFormsModule,
        UcSubsectionModule,
        SharingComponentModule,
        UcapprovalhistModule,
        UcShowErrorsModule,
        AppCustViewComponentsModule,
        AppViewComponentsModule,
        SharedModule
    ],
    declarations: [
        AppListViewComponent
    ],
    entryComponents: [
        UclookupgenericComponent,
        UcviewgenericComponent,
        UcgridviewComponent,
        UcapprovalhistComponent
    ]
})
export class AppListViewModule { }