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
import { MouViewComponent } from "./mou-view.component";
import { MouViewRoutingModule } from "./mou-view-routing.module";
import { MouViewDetailComponent } from "./mou-view-detail/mou-view-detail.component";
import { MouViewAddcollComponent } from "./mou-view-addcoll/mou-view-addcoll.component";
import { MouViewApprovalHistoryComponent } from "./mou-view-approval-history/mou-view-approval-history.component";
import { MouViewDocComponent } from "./mou-view-doc/mou-view-doc.component";
import { MouViewFeeComponent } from "./mou-view-fee/mou-view-fee.component";
import { MouViewLegalComponent } from "./mou-view-legal/mou-view-legal.component";
import { MouViewListedCustFactoringComponent } from "./mou-view-listed-cust-factoring/mou-view-listed-cust-factoring.component";
import { MouViewSurveyComponent } from "./mou-view-survey/mou-view-survey.component";
import { MouViewTcComponent } from "./mou-view-tc/mou-view-tc.component";
import { SharedModule } from "app/shared/shared.module";
import { MouViewChangeMouHistoryComponent } from "./mou-view-change-mou-history/mou-view-change-mou-history.component";
import { MouViewFreezeUnfreezeHistoryComponent } from "./mou-view-freeze-unfreeze-history/mou-view-freeze-unfreeze-history.component";
import { UcapprovalHistoryModule } from "@adins/ucapproval-history";
import { ViewModule } from "../view.module";
import { MouViewApprovalRecommendationComponent } from "./mou-view-approval-recommendation/mou-view-approval-recommendation.component";
import { MouViewSrvyTaskComponent } from "./mou-view-srvy-task/mou-view-srvy-task.component";
import { MouViewXComponent } from 'app/impl/view-enhancing/mou-view/mou-view-x.component';
import { MouViewAddcollXComponent } from 'app/impl/view-enhancing/mou-view/mou-view-addcoll/mou-view-addcoll-x.component';
import { MouViewDetailXComponent } from "app/impl/view-enhancing/mou-view/mou-view-detail/mou-view-detail-x.component";
import { ShrCompMouModule } from "app/components/sharing-components/shr-comp-mou/shr-comp-mou.module";
import { MouViewChangeMouHistoryXComponent } from "app/impl/view-enhancing/mou-view/mou-view-change-mou-history/mou-view-change-mou-history-x/mou-view-change-mou-history-x.component";
import { AdInsSharedModule } from "app/components/adins-module/adIns-shared.module";
import { MouViewCustomerComponent } from "./mou-view-customer/mou-view-customer.component";
import { MouViewCustomerPersonalComponent } from "./mou-view-customer-personal/mou-view-customer-personal.component";
import { MouViewCustomerCompanyComponent } from "./mou-view-customer-company/mou-view-customer-company.component";
import { MouViewCustomerBankAccountComponent } from "./mou-view-customer-bank-account/mou-view-customer-bank-account.component";
import { MouViewCustomerJobDataComponent } from "./mou-view-customer-job-data/mou-view-customer-job-data.component";
import { MouViewCustomerSocmedComponent } from "./mou-view-customer-socmed/mou-view-customer-socmed.component";
import { MouViewCustomerGrpMbrComponent } from "./mou-view-customer-grp-mbr/mou-view-customer-grp-mbr.component";
import { MouViewCustomerAddrComponent } from "./mou-view-customer-addr/mou-view-customer-addr.component";
import { MouViewCustomerMgmntShrholderComponent } from "./mou-view-customer-mgmnt-shrholder/mou-view-customer-mgmnt-shrholder.component";
import { MouViewCustomerCompLegalDocComponent } from "./mou-view-customer-comp-legal-doc/mou-view-customer-comp-legal-doc.component";
import { MouViewCustomerCompFinDataComponent } from "./mou-view-customer-comp-fin-data/mou-view-customer-comp-fin-data.component";
import { MouViewCustomerCompContactInfoComponent } from "./mou-view-customer-comp-contact-info/mou-view-customer-comp-contact-info.component";
import { MouViewCustomerPersonalContactInfoComponent } from "./mou-view-customer-personal-contact-info/mou-view-customer-personal-contact-info.component";
import { MouViewCustomerPersonalPersonalFinDataComponent } from "./mou-view-customer-personal-personal-fin-data/mou-view-customer-personal-personal-fin-data.component";
@NgModule({
    imports: [
        MouViewRoutingModule,
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
        SharedModule,
        AdInsSharedModule,
        UcapprovalHistoryModule,
        ShrCompMouModule,
        ViewModule
    ],
    declarations: [
        MouViewComponent,
        MouViewDetailComponent,
        MouViewAddcollComponent,
        MouViewApprovalHistoryComponent,
        MouViewDocComponent,
        MouViewFeeComponent,
        MouViewLegalComponent,
        MouViewListedCustFactoringComponent,
        MouViewSurveyComponent,
        MouViewTcComponent,
        MouViewSrvyTaskComponent,
        MouViewChangeMouHistoryComponent,
        MouViewChangeMouHistoryXComponent,
        MouViewFreezeUnfreezeHistoryComponent,
        MouViewApprovalRecommendationComponent,
        MouViewXComponent,
        MouViewAddcollXComponent,
        MouViewDetailXComponent,
        MouViewCustomerComponent,
        MouViewCustomerPersonalComponent,
        MouViewCustomerCompanyComponent,
        MouViewCustomerBankAccountComponent,
        MouViewCustomerJobDataComponent,
        MouViewCustomerSocmedComponent,
        MouViewCustomerGrpMbrComponent,
        MouViewCustomerAddrComponent,
        MouViewCustomerMgmntShrholderComponent,
        MouViewCustomerCompFinDataComponent,
        MouViewCustomerCompContactInfoComponent,
        MouViewCustomerCompLegalDocComponent,
        MouViewCustomerPersonalContactInfoComponent,
        MouViewCustomerPersonalPersonalFinDataComponent
    ],
    entryComponents: [
        UclookupgenericComponent,
        UcviewgenericComponent,
        UcgridviewComponent,
        UcapprovalhistComponent,
    ],
    exports: [
        MouViewAddcollXComponent,
        MouViewDetailXComponent
    ]

})
export class MouViewModule { }
