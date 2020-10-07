import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { UcSubsectionModule } from "@adins/uc-subsection";
import { CustCompletionPagingComponent } from "./cust-completion-paging/cust-completion-paging.component";
import { CustCompletionDetailComponent } from "./cust-completion-detail/cust-completion-detail.component";
import { CustCompletionRoutingModule } from "./cust-completion-routing.module";


@NgModule({
    declarations: [
        CustCompletionPagingComponent,
        CustCompletionDetailComponent
    ],
    imports: [
        CommonModule,
        AdInsModule,
        UcSubsectionModule,
        CustCompletionRoutingModule
    ],
    exports: [],
    providers: [
        NGXToastrService
      ]
})

export class CustCompletionModule { }