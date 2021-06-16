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
import { AppCustViewComponentsModule } from "app/components/general/app-cust-view/app-cust-view.components.module";
import { AppViewComponentsModule } from "app/components/general/app-view/app-view.components.module";
import { SharedModule } from "app/shared/shared.module";
import { AppAssetViewRoutingModule } from "./app-asset-view-routing.module";
import { AppAssetViewComponent } from './app-asset-view.component';
import { AppAssetViewAssetDetailComponent } from './app-asset-view-asset-detail/app-asset-view-asset-detail.component';
import { AppAssetViewAssetExpenseComponent } from './app-asset-view-asset-expense/app-asset-view-asset-expense.component';
import { AppAssetViewAssetInfoComponent } from './general/app-asset-view-asset-info/app-asset-view-asset-info.component';
import { AppAssetViewFinancialDataComponent } from './app-asset-view-financial-data/app-asset-view-financial-data.component';
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { createTranslateLoader } from "app/app.module";
import { HttpClient } from "@angular/common/http";

@NgModule({
    imports: [
        AppAssetViewRoutingModule,
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
        AppCustViewComponentsModule,
        AppViewComponentsModule,
        SharedModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            }
        }),        
    ],
    declarations: [
        AppAssetViewComponent,
        AppAssetViewAssetDetailComponent,
        AppAssetViewAssetExpenseComponent,
        AppAssetViewAssetInfoComponent,
        AppAssetViewFinancialDataComponent
    ],
    entryComponents: [
        UclookupgenericComponent,
        UcviewgenericComponent,
        UcgridviewComponent,
        UcapprovalhistComponent
    ]
})
export class AppAssetViewModule { }