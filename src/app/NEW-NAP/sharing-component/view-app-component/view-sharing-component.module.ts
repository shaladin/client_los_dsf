import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { AppCustViewComponentsModule } from "app/components/general/app-cust-view/app-cust-view.components.module";
import { ViewSurveyVerifComponent } from "./view-survey-verif/view-survey-verif.component";
import { ViewHighlightCommentComponent } from "./view-highlight-comment/view-highlight-comment.component";
import { ViewAssetDataXComponent } from "app/impl/view-enhancing/app-view/view-asset-data/view-asset-data-x.component";
import { ViewAssetDataDetailXComponent } from "app/impl/view-enhancing/app-view/view-asset-data/view-asset-data-detail/view-asset-data-detail-x.component";
import { AppViewComponentsModule } from "app/components/general/app-view/app-view.components.module";
import { AdInsSharedModule } from "app/components/adins-module/adIns-shared.module";

@NgModule({
    exports: [
        AppCustViewComponentsModule,
        ViewHighlightCommentComponent,
        ViewAssetDataXComponent,
        ViewAssetDataDetailXComponent
    ],
    imports: [
        CommonModule,
        AdInsModule,
        AppViewComponentsModule,
        AdInsSharedModule,
        AppCustViewComponentsModule
    ],
    declarations: [
        ViewHighlightCommentComponent,
        ViewAssetDataXComponent,
        ViewAssetDataDetailXComponent
    ],
    entryComponents: [
        ViewAssetDataDetailXComponent
    ],
    providers: [
        NGXToastrService
    ]
})
export class ViewSharingComponentModule { }
