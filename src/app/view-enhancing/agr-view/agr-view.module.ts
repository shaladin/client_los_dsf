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
import { AgrMainInfoComponent } from "../agr-main-info/agr-main-info.component";
import { AppCustViewComponentsModule } from "app/components/general/app-cust-view/app-cust-view.components.module";
import { AppViewComponentsModule } from "app/components/general/app-view/app-view.components.module";
import { ViewAssetCollateralComponent } from "./view-asset-collateral/view-asset-collateral.component";
import { ViewAssetCollateralDetailComponent } from "./view-asset-collateral/view-asset-collateral-detail/view-asset-collateral-detail.component";
import { SharedModule } from "app/shared/shared.module";
import { ViewInsuranceDetailComponent } from "./view-insurance-detail/view-insurance-detail.component";
import { ViewSharingComponentModule } from "app/NEW-NAP/sharing-component/view-app-component/view-sharing-component.module";
import { ViewInsuranceDataXComponent } from "app/impl/view-enhancing/agr-view/view-insurance-data/view-insurance-data-x.component";
import { ViewInsuranceDataDetailXComponent } from "app/impl/view-enhancing/agr-view/view-insurance-data/view-insurance-data-detail-x/view-insurance-data-detail-x.component";
import { AgrMainInfoXComponent } from "app/impl/view-enhancing/agr-main-info/agr-main-info-x.component";
import { AgreementViewContainerXComponent } from "app/impl/view-enhancing/agr-view/agreement-view-container-x.component";
import { ViewAgrmntTcComponent } from "./view-agrmnt-tc/view-agrmnt-tc.component";
import { AdInsSharedModule } from "app/components/adins-module/adIns-shared.module";
import { ViewDeliveryOrderMultiComponent } from './view-delivery-order/view-delivery-order-multi/view-delivery-order-multi.component';
import { ViewDeliveryOrderDetailComponent } from './view-delivery-order/view-delivery-order-detail/view-delivery-order-detail.component';
import { ViewDeliveryOrderAssetSingleComponent } from './view-delivery-order/view-delivery-order-detail/view-delivery-order-asset-single/view-delivery-order-asset-single.component';
import { ViewPurchaseOrderListComponent } from "./view-purchase-order-list/view-purchase-order-list.component";
import { ViewPurchaseOrderDetailComponent } from "./view-purchase-order-detail/view-purchase-order-detail.component";
import { ViewPurchaseOrderNewListComponent } from "./view-purchase-order-new-list/view-purchase-order-new-list.component";
import { ViewPurchaseOrderNewDetailComponent } from "./view-purchase-order-new-detail/view-purchase-order-new-detail.component";
import { ViewPurchaseOrderNewListXComponent } from 'app/impl/view-enhancing/agr-view/view-purchase-order-new-list/view-purchase-order-new-list-x.component';
import {
  ViewPurchaseOrderListXComponent
} from 'app/impl/view-enhancing/agr-view/view-purchase-order-list/view-purchase-order-list-x.component';
import {
  ViewPurchaseOrderDetailXComponent
} from 'app/impl/view-enhancing/agr-view/view-purchase-order-detail/view-purchase-order-detail-x.component';
import { ViewCommissionXComponent } from "app/impl/view-enhancing/agr-view/view-commission/view-commission-x.component";
import { ListDataCommissionAgrmntXComponent } from "app/impl/view-enhancing/agr-view/view-commission/list-data-commission/list-data-commission-x.component";
import { ViewInvoiceDataXComponent } from "app/impl/view-enhancing/agr-view/view-invoice-data/view-invoice-data-x.component";
import { InvoiceMainInfoXComponent } from "app/impl/view-enhancing/invoice-main-info/invoice-main-info-x.component";

@NgModule({
    imports: [
        AgrViewRoutingModule,
        CommonModule,
        AdInsSharedModule,
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
        SharedModule,
        ViewSharingComponentModule
    ],
    declarations: [
        AgreementViewContainerComponent,
        AgreementViewContainerXComponent,
        ViewAssetCollateralComponent,
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
        ViewAgrmntDocumentComponent,
        AgrMainInfoComponent,
        AgrMainInfoXComponent,
        InvoiceMainInfoXComponent,
        ViewAssetCollateralDetailComponent,
        ViewInsuranceDetailComponent,
        ViewInsuranceDataXComponent,
        ViewInsuranceDataDetailXComponent,
        ViewAgrmntTcComponent,
        ViewDeliveryOrderMultiComponent,
        ViewDeliveryOrderDetailComponent,
        ViewDeliveryOrderAssetSingleComponent,
        ViewPurchaseOrderListComponent,
        ViewPurchaseOrderDetailComponent,
        ViewPurchaseOrderNewListComponent,
        ViewPurchaseOrderNewDetailComponent,
        ViewPurchaseOrderNewListXComponent,
        ViewPurchaseOrderListXComponent,
        ViewPurchaseOrderDetailXComponent,
        ViewCommissionXComponent,
        ListDataCommissionAgrmntXComponent,
        ViewInvoiceDataXComponent
    ],
    entryComponents: [
        UclookupgenericComponent,
        UcviewgenericComponent,
        UcgridviewComponent,
        UcapprovalhistComponent,
        ViewAssetCollateralDetailComponent,
        ViewDeliveryOrderAssetSingleComponent,
        ViewPurchaseOrderDetailComponent,
        ViewPurchaseOrderNewDetailComponent,
        ViewInsuranceDataDetailXComponent,
        ViewPurchaseOrderDetailXComponent,
    ],
    exports: [
        AgrMainInfoXComponent,
        InvoiceMainInfoXComponent
    ]

})
export class AgrViewModule { }
