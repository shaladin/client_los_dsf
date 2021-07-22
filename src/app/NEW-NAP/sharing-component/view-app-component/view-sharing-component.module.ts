import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { AppCustViewComponentsModule } from "app/components/general/app-cust-view/app-cust-view.components.module";
import { ViewSurveyVerifComponent } from "./view-survey-verif/view-survey-verif.component";
import { ViewHighlightCommentComponent } from "./view-highlight-comment/view-highlight-comment.component";

@NgModule({
    exports: [
        AppCustViewComponentsModule,
        ViewHighlightCommentComponent
    ],
    imports: [
        CommonModule,
        AdInsModule,
        AppCustViewComponentsModule
    ],
    declarations: [
        ViewHighlightCommentComponent
    ],
    providers: [
        NGXToastrService
    ]
})
export class ViewSharingComponentModule { }
