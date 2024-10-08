import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { UcSubsectionModule } from '@adins/uc-subsection';
import { UcviewgenericModule } from '@adins/ucviewgeneric';
import { UcgridviewModule } from '@adins/ucgridview';
import { AppTcComponent } from './app-tc/app-tc.component';
import { ViewAssetDataComponent } from './view-asset-data/view-asset-data.component';
import { ViewInsuranceComponent } from './view-insurance/view-insurance.component';
import { ViewCollateralDataComponent } from './view-collateral-data/view-collateral-data.component';
import { AdInsSharedModule } from 'app/components/adins-module/adIns-shared.module';
import { ViewAssetDataXComponent } from 'app/impl/general/app-view/view-asset-data/view-asset-data-x.component';
import { ViewCollateralDataDsfComponent } from 'app/dsf/impl/view-enhancing/app-view/view-collateral-data-dsf/view-collateral-data-dsf.component';

@NgModule({
    imports: [
        CommonModule,
        AdInsSharedModule,
        UcSubsectionModule,
        UcviewgenericModule,
        UcgridviewModule
    ],
    declarations: [
        AppTcComponent,
        ViewAssetDataComponent,
        ViewAssetDataXComponent,
        ViewInsuranceComponent,
        ViewCollateralDataComponent,
        ViewCollateralDataDsfComponent
    ],
    exports: [
        AppTcComponent,
        ViewAssetDataComponent,
        ViewAssetDataXComponent,
        ViewInsuranceComponent,
        ViewCollateralDataComponent,
        ViewCollateralDataDsfComponent
    ]
})
export class AppViewComponentsModule { }
