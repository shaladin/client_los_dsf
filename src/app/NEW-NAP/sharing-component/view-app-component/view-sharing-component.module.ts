import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { AppCustViewComponentsModule } from "app/components/general/app-cust-view/app-cust-view.components.module";
import { ViewSurveyVerifComponent } from "./view-survey-verif/view-survey-verif.component";
import { ViewHighlightCommentComponent } from "./view-highlight-comment/view-highlight-comment.component";
import { AppAssetDataXComponent } from "app/impl/view-enhancing/app-view/app-asset-data/app-asset-data-x.component";
import { AppAssetDataDetailXComponent } from "app/impl/view-enhancing/app-view/app-asset-data/app-asset-data-detail/app-asset-data-detail-x.component";
import { AppViewComponentsModule } from "app/components/general/app-view/app-view.components.module";
import { AppInsuranceComponent } from "app/view-enhancing/app-view/app-insurance/app-insurance.component";

@NgModule({
    exports: [
        AppCustViewComponentsModule,
        ViewHighlightCommentComponent,
        AppInsuranceComponent,
        AppAssetDataXComponent,
        AppAssetDataDetailXComponent
    ],
    imports: [
        CommonModule,
        AdInsModule,
        AppCustViewComponentsModule,
        AppViewComponentsModule
    ],
    declarations: [
        ViewHighlightCommentComponent,
        AppInsuranceComponent,
        AppAssetDataXComponent,
        AppAssetDataDetailXComponent
    ],
    entryComponents: [
        AppAssetDataDetailXComponent
    ],
    providers: [
        NGXToastrService
    ]
})
export class ViewSharingComponentModule { }
