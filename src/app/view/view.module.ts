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
import { ViewRoutingModule } from "./view-routing.module";
import { MainInfoComponent } from './main-info/main-info.component';
import { LeadMainInfoComponent } from './lead-main-info/lead-main-info.component';
// import { ShowErrorsComponent } ../NEW-NAP/view/app-view/app-view.componentors.component";

@NgModule({
  imports: [
    ViewRoutingModule,
    CommonModule,
    FormsModule,
    HttpModule,
    UCSearchModule,
    UcgridfooterModule,
    UcpagingModule,
    NgbModule,
    SharingModule,
    ArchwizardModule,
    ReactiveFormsModule,
    UcSubsectionModule,
    SharingComponentModule
  ],
  declarations: [
    MainInfoComponent,
    LeadMainInfoComponent
  ]
})
export class ViewModule { }