import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { UCSearchModule } from "@adins/ucsearch";
import { UcpagingModule } from "@adins/ucpaging";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { UcSubsectionModule } from "@adins/uc-subsection";
import { SharingComponentModule } from 'app/shared/sharingcomponent.module';
import { UcgridfooterModule } from "@adins/ucgridfooter";
import { FraudDetectionRoutingComponent } from "./fraud-detection-routing.module";
import { FraudDetectionPagingComponent } from './fraud-detection-paging/fraud-detection-paging.component';
import { FraudDetectionVerifComponent } from './fraud-detection-verif/fraud-detection-verif.component';

@NgModule({
    imports: [
        FraudDetectionRoutingComponent,
        CommonModule,
        FormsModule,
        HttpModule,
        UCSearchModule,
        UcgridfooterModule,
        UcpagingModule,
        NgbModule,
        ReactiveFormsModule,
        UcSubsectionModule,
        SharingComponentModule
    ],
    declarations: [

    FraudDetectionPagingComponent,

    FraudDetectionVerifComponent]
})
export class FraudDetectionModule {

}
