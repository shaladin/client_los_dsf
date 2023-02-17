import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { UcpagingModule } from "@adins/ucpaging";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { SharingModule } from 'app/shared/sharing.module';
import { ArchwizardModule } from 'angular-archwizard';
import { UcSubsectionModule } from "@adins/uc-subsection";
import { SharingComponentModule } from 'app/shared/sharingcomponent.module';
import { UcgridfooterModule } from "@adins/ucgridfooter";
import { UcviewgenericComponent, UcviewgenericModule } from "@adins/ucviewgeneric";
import { UcgridviewModule, UcgridviewComponent } from "@adins/ucgridview";

import { UcShowErrorsModule } from "@adins/uc-show-errors";
import { SharedModule } from "app/shared/shared.module";
import { AutoDebitRegistrationViewComponent } from "app/impl/NEW-NAP/business-process/additional-process/auto-debit-registration/auto-debit-registration-view/auto-debit-registration-view.component";
import { AutoDebitRegisViewRoutingModule } from "./auto-debit-regis-view-routing,module";
@NgModule({
    imports: [
        AutoDebitRegisViewRoutingModule,
        CommonModule,
        FormsModule,
        HttpModule,
        UcgridfooterModule,
        UcpagingModule,
        UcviewgenericModule,
        UcgridviewModule,
        NgbModule,
        SharingModule,
        ArchwizardModule,
        ReactiveFormsModule,
        UcSubsectionModule,
        SharingComponentModule,
        UcShowErrorsModule,
        SharedModule,
    ],
    declarations: [
        AutoDebitRegistrationViewComponent
    ],
    exports: [
    ],
    entryComponents: [
        UcviewgenericComponent,
        UcgridviewComponent,
    ]

})
export class AutoDebitRegisViewModule { }
