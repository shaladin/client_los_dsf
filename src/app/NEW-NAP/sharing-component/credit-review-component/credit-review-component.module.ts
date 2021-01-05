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
        CrdRvwDukcapilHistComponent
    ],
    imports: [
        CommonModule,
        AdInsModule,
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
        CrdRvwDukcapilHistComponent
    ],
    providers: [
        NGXToastrService
    ]
})
export class CreditReviewComponentModule { }