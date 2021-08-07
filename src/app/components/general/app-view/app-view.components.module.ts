import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { UcSubsectionModule } from '@adins/uc-subsection';
import { UcviewgenericModule } from '@adins/ucviewgeneric';
import { UcgridviewModule } from '@adins/ucgridview';
import { AppTcComponent } from './app-tc/app-tc.component';
import { ViewAssetDataComponent } from './view-asset-data/view-asset-data.component';
import { ViewInsuranceComponent } from './view-insurance/view-insurance.component';
import { ViewCollateralDataComponent } from './view-collateral-data/view-collateral-data.component';

@NgModule({
    imports: [
        CommonModule,
        UcSubsectionModule,
        UcviewgenericModule,
        UcgridviewModule
    ],
    declarations: [
        AppTcComponent,
        ViewAssetDataComponent,
        ViewInsuranceComponent,
        ViewCollateralDataComponent
    ],
    exports: [
        AppTcComponent,
        ViewAssetDataComponent,
        ViewInsuranceComponent,
        ViewCollateralDataComponent
    ]
})
export class AppViewComponentsModule { }
