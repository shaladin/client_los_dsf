import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule} from "@angular/forms";
import { HttpModule } from "@angular/http";
import { UCSearchModule } from "@adins/ucsearch";
import { UcpagingModule } from "@adins/ucpaging";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { RouterModule } from "@angular/router";
import { SharingModule } from 'app/shared/sharing.module';
import { ArchwizardModule } from 'angular-archwizard';
import { UcSubsectionModule } from "@adins/uc-subsection";
import { SharingComponentModule } from 'app/shared/sharingcomponent.module';
import { UcgridfooterModule, UcgridfooterComponent } from "@adins/ucgridfooter";
import { UcviewgenericModule } from "@adins/ucviewgeneric";
import { ApplicationModelRoutingModule } from "./ApplicationModel-routing.module";
import { ApplicationModelAddComponent } from "./application-model-add/application-model-add.component";
import { UcShowErrorsModule } from '@adins/uc-show-errors';


// import { ShowErrorsComponent } from "./app/test-new/show-errors.component";

@NgModule({
  imports: [

    CommonModule,
    FormsModule,
    HttpModule,
    UCSearchModule,
    UcgridfooterModule,
    UcpagingModule,
    NgbModule,
    SharingModule,
    ArchwizardModule,
    UcSubsectionModule,
    SharingComponentModule,
    RouterModule,
    UcviewgenericModule,
    ApplicationModelRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    UcShowErrorsModule
  ],
  declarations: [
    ApplicationModelAddComponent
  ]
})
export class ApplicationModelModule { }