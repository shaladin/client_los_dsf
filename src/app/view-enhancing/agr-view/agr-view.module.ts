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
import { AgrViewRoutingModule } from "./agr-view-routing.module";
import { AgreementViewContainerComponent } from "./agreement-view-container.component";
import { ViewCollateralComponent } from "./view-collateral/view-collateral.component";
import { ViewAppCollateralMultiComponent } from "./view-app-collateral-multi/view-app-collateral-multi.component";
import { ViewAppCollateralSingleComponent } from "./view-app-collateral-single/view-app-collateral-single.component";
import { ViewAgrmntInsuranceComponent } from "./view-insurance/view-insurance.component";
import { AgrmntLifeInsuranceComponent } from "./life-insurance/life-insurance.component";
import { AgrmntFinancialComponent } from "./agrmnt-financial/agrmnt-financial.component";
import { ViewCommissionComponent } from "./view-commission/view-commission.component";
import { ListDataCommissionAgrmntComponent } from "./view-commission/list-data-commission/list-data-commission.component";
import { ViewAgrmntReservedFundComponent } from "./view-reserved-fund/view-reserved-fund.component";
import { ViewPurchaseOrderComponent } from "./view-purchase-order/view-purchase-order.component";
import { ViewDeviationComponent } from "./view-deviation/view-deviation.component";
import { ViewDeliveryOrderComponent } from "./view-delivery-order/view-delivery-order.component";
import { ViewAgrmntDocumentComponent } from "./view-document/view-document.component";
import { ViewAgrmntSummaryComponent } from "./view-summary/view-summary.component";


@NgModule({
    imports: [
        AgrViewRoutingModule,
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
    ],
    declarations: [
        AgreementViewContainerComponent,
        ViewCollateralComponent,
        ViewAppCollateralMultiComponent,
        ViewAppCollateralSingleComponent,
        ViewAgrmntInsuranceComponent,
        AgrmntLifeInsuranceComponent,
        AgrmntFinancialComponent,
        ViewCommissionComponent,
        ListDataCommissionAgrmntComponent,
        ViewAgrmntReservedFundComponent,
        ViewPurchaseOrderComponent,
        ViewDeviationComponent,
        ViewDeliveryOrderComponent,
        ViewAgrmntSummaryComponent,
        ViewAgrmntDocumentComponent
    ],
    entryComponents: [
        UclookupgenericComponent,
        UcviewgenericComponent,
        UcgridviewComponent,
        UcapprovalhistComponent,
    ]

})
export class AgrViewModule { }