import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { InvoiceDataFctrComponent } from './invoice-data-fctr/invoice-data-fctr.component';
import { TabReferantorComponent } from './tab-referantor/tab-referantor.component';
import { TabCommissionComponent } from './tab-commission/tab-commission.component';
import { ListDataCommissionComponent } from './tab-commission/list-data-commission/list-data-commission.component';
import { ViewReservedFundComponent } from "./view-reserved-fund/view-reserved-fund.component";
import { LifeInsuranceComponent } from './life-insurance/life-insurance.component';
import { AppTcComponent } from './app-tc/app-tc.component';
import { GuarantorComponent } from './guarantor/guarantor.component';
import { ViewPhoneVerifComponent } from "./view-phone-verif/view-phone-verif.component";
import { ViewAssetDataComponent } from "./view-asset-data/view-asset-data.component";
import { TabApplicationComponent } from './tab-application/tab-application.component';
import { TabAnalysisResultComponent } from './tab-analysis-result/tab-analysis-result.component';
import { AppAssetDataComponent } from './app-asset-data/app-asset-data.component';
import { AppAssetDataDetailComponent } from './app-asset-data/app-asset-data-detail/app-asset-data-detail.component';
import { ViewSharingComponentModule } from "./view-sharing-component.module";
import { ApprovalHistComponent } from './approval-hist/approval-hist.component';
import { UcapprovalhistModule  } from '@adins/ucapprovalhist';

@NgModule({
  exports: [

  ],
  imports: [
    CommonModule,
    AdInsModule,
    ViewSharingComponentModule,
    UcapprovalhistModule
  ],
  declarations: [
    InvoiceDataFctrComponent,
    TabReferantorComponent,
    TabCommissionComponent,
    ListDataCommissionComponent,
    ViewReservedFundComponent,
    LifeInsuranceComponent,
    AppTcComponent,
    GuarantorComponent,
    ViewPhoneVerifComponent,
    ViewAssetDataComponent,
    TabApplicationComponent,
    TabAnalysisResultComponent,
    AppAssetDataComponent,
    AppAssetDataDetailComponent,
    ApprovalHistComponent
  ],
  providers: [
    NGXToastrService
  ]
})
export class ViewAppComponentModule { }
