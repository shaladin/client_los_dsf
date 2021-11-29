import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { MatRadioModule } from "@angular/material";
import { CrdRvwCustInfoComponent } from "./crd-rvw-cust-info/crd-rvw-cust-info.component";
import { CrdRvwFamGuarComponent } from "./crd-rvw-fam-guar/crd-rvw-fam-guar.component";
import { CrdRvwThirdPartyCheckingComponent } from "./crd-rvw-third-party-checking/crd-rvw-third-party-checking.component";
import { CrdRvwAppInfoComponent } from "./crd-rvw-app-info/crd-rvw-app-info.component";
import { CrdRvwAssetComponent } from "./crd-rvw-asset/crd-rvw-asset.component";
import { CrdRvwAdditionalCollComponent } from "./crd-rvw-additional-coll/crd-rvw-additional-coll.component";
import { CrdRvwDealerInfoComponent } from "./crd-rvw-dealer-info/crd-rvw-dealer-info.component";
import { CrdRvwCreditScoringComponent } from "./crd-rvw-credit-scoring/crd-rvw-credit-scoring.component";
import { CrdRvwIncomeExpenseComponent } from "./crd-rvw-income-expense/crd-rvw-income-expense.component";
import { CrdRvwBankStmntComponent } from "./crd-rvw-bank-stmnt/crd-rvw-bank-stmnt.component";
import { CrdRvwRapindoComponent } from "./crd-rvw-rapindo/crd-rvw-rapindo.component";
import { CrdRvwDukcapilHistComponent } from "./crd-rvw-dukcapil-hist/crd-rvw-dukcapil-hist.component";
import { CrdRvwCmoInfoComponent } from "./crd-rvw-cmo-info/crd-rvw-cmo-info.component";
import { CrdRvwCustPersonalInfoComponent } from './crd-rvw-cust-info/crd-rvw-cust-personal-info/crd-rvw-cust-personal-info.component';
import { CrdRvwCustCompanyInfoComponent } from './crd-rvw-cust-info/crd-rvw-cust-company-info/crd-rvw-cust-company-info.component';
import { CrdRvwBankStatementComponent } from './crd-rvw-cust-info/component/crd-rvw-bank-statement/crd-rvw-bank-statement.component';
import { CrdRvwNegCheckListComponent } from './crd-rvw-cust-info/component/crd-rvw-neg-check-list/crd-rvw-neg-check-list.component';
import { CrdRvwDiffWithMasterCustComponent } from './crd-rvw-cust-info/component/crd-rvw-diff-with-master-cust/crd-rvw-diff-with-master-cust.component';
import { CrdRvwDiffWithInProcessAppComponent } from './crd-rvw-cust-info/component/crd-rvw-diff-with-in-process-app/crd-rvw-diff-with-in-process-app.component';
import { CrdRvwLegalDocComponent } from './crd-rvw-legal-doc/crd-rvw-legal-doc.component';
import { CrdRvwTableCustComponent } from './crd-rvw-fam-guar/crd-rvw-table-cust/crd-rvw-table-cust.component';
import { AppRvwSummaryAssetComponent } from "./app-rvw-summary-asset/app-rvw-summary-asset.component";
import { CrdRvwAssetAccComponent } from './crd-rvw-asset-acc/crd-rvw-asset-acc.component';
import { CrdRvwAppInfoXComponent } from "app/impl/NEW-NAP/sharing-component/credit-review-component/crd-rvw-app-info/crd-rvw-app-info-x.component";
import { CrdRvwCustPersonalInfoXComponent } from "app/impl/NEW-NAP/sharing-component/credit-review-component/crd-rvw-cust-info-x/crd-rvw-cust-personal-info-x/crd-rvw-cust-personal-info-x.component";
import { CrdRvwCustCompanyInfoXComponent } from "app/impl/NEW-NAP/sharing-component/credit-review-component/crd-rvw-cust-info-x/crd-rvw-cust-company-info-x/crd-rvw-cust-company-info-x.component";
import { CrdRvwCustInfoXComponent } from "app/impl/NEW-NAP/sharing-component/credit-review-component/crd-rvw-cust-info-x/crd-rvw-cust-info-x.component";
import { CrdRvwCustHistDataXComponent } from "app/impl/NEW-NAP/sharing-component/credit-review-component/crd-rvw-cust-info-x/component/crd-rvw-cust-hist-data-x/crd-rvw-cust-hist-data-x.component";
import { ViewMainInfoComponentModule } from "../view-main-info-component/view-main-info-component.module";
import { CrdRvwSurveyDataXComponent } from "app/impl/NEW-NAP/sharing-component/credit-review-component/crd-rvw-cust-info-x/component/crd-rvw-survey-data-x/crd-rvw-survey-data-x.component";
import { CrdRvwThirdPartyCheckingXComponent } from "app/impl/NEW-NAP/sharing-component/credit-review-component/crd-rvw-third-party-checking-x/crd-rvw-third-party-checking-x.component";
import { SharedModule } from "app/shared/shared.module";
import { AdInsSharedModule } from "app/components/adins-module/adIns-shared.module";

@NgModule({
    exports: [
        CrdRvwCustInfoComponent, 
        CrdRvwFamGuarComponent, 
        CrdRvwThirdPartyCheckingComponent, 
        CrdRvwAppInfoComponent, 
        CrdRvwAssetComponent, 
        CrdRvwAdditionalCollComponent, 
        CrdRvwCmoInfoComponent, 
        CrdRvwDealerInfoComponent, 
        CrdRvwCreditScoringComponent, 
        CrdRvwIncomeExpenseComponent, 
        CrdRvwBankStmntComponent, 
        CrdRvwRapindoComponent,
        CrdRvwDukcapilHistComponent,
        CrdRvwLegalDocComponent,
        AppRvwSummaryAssetComponent,
        CrdRvwAssetAccComponent,
        CrdRvwAppInfoXComponent,
        CrdRvwCustInfoXComponent,
        CrdRvwCustHistDataXComponent,
        CrdRvwSurveyDataXComponent,
        CrdRvwThirdPartyCheckingXComponent
    ],
    imports: [
        CommonModule,
        AdInsModule,
        ViewMainInfoComponentModule,
        AdInsSharedModule,
        SharedModule,
        MatRadioModule
    ],
    declarations: [
        CrdRvwCustInfoComponent, 
        CrdRvwFamGuarComponent, 
        CrdRvwThirdPartyCheckingComponent, 
        CrdRvwAppInfoComponent, 
        CrdRvwAssetComponent, 
        CrdRvwAdditionalCollComponent, 
        CrdRvwCmoInfoComponent, 
        CrdRvwDealerInfoComponent, 
        CrdRvwCreditScoringComponent, 
        CrdRvwIncomeExpenseComponent, 
        CrdRvwBankStmntComponent, 
        CrdRvwRapindoComponent,
        CrdRvwDukcapilHistComponent,
        CrdRvwCustPersonalInfoComponent,
        CrdRvwCustCompanyInfoComponent,
        CrdRvwBankStatementComponent,
        CrdRvwNegCheckListComponent,
        CrdRvwDiffWithMasterCustComponent,
        CrdRvwDiffWithInProcessAppComponent,
        CrdRvwLegalDocComponent,
        CrdRvwTableCustComponent,
        AppRvwSummaryAssetComponent,
        CrdRvwAssetAccComponent,
        CrdRvwAppInfoXComponent,
        CrdRvwCustPersonalInfoXComponent,
        CrdRvwCustCompanyInfoXComponent,
        CrdRvwCustInfoXComponent,
        CrdRvwCustHistDataXComponent,
        CrdRvwSurveyDataXComponent,
        CrdRvwThirdPartyCheckingXComponent
    ],
    providers: [
        NGXToastrService
    ],
    entryComponents: [
    ]
})
export class CreditReviewComponentModule { }
