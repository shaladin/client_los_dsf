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
import { UclookupgenericModule } from "@adins/uclookupgeneric";
import { UcviewgenericComponent, UcviewgenericModule } from "@adins/ucviewgeneric";
import { UcgridviewModule, UcgridviewComponent } from "@adins/ucgridview";
import { CustExposureViewRoutingModule } from "./cust-exposure-view-routing.module";
import { CustExposureViewComponent } from "./cust-exposure-view.component";
import { ObligorExposureComponent } from './obligor-exposure/obligor-exposure.component';
import { CustExposureComponent } from './cust-exposure/cust-exposure.component';
import { AdInsSharedModule } from "app/components/adins-module/adIns-shared.module";
import { CustExposureViewXComponent } from "app/impl/view-enhancing/cust-exposure-view/cust-exposure-view-x.component";
import { ObligorExposureXComponent } from "app/impl/view-enhancing/cust-exposure-view/obligor-exposure/obligor-exposure-x.component";
import { CustExposureXComponent } from "app/impl/view-enhancing/cust-exposure-view/cust-exposure/cust-exposure-x.component";

@NgModule({
    imports: [
        CustExposureViewRoutingModule,
        CommonModule,
        FormsModule,
        AdInsSharedModule,
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
        SharingComponentModule
    ],
    declarations: [
        CustExposureViewComponent,
        ObligorExposureComponent,
        CustExposureComponent,
        CustExposureViewXComponent,
        ObligorExposureXComponent,
        CustExposureXComponent
    ],
    entryComponents: [
    ],
    exports: [
        ObligorExposureXComponent,
        CustExposureXComponent
    ]

})
export class CustExposureViewModule { }