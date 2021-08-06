import { SettingRoutingModule } from 'app/setting/setting-routing.module';
import { NgModule, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UCSearchModule } from '@adins/ucsearch';
import { UcgridfooterModule } from '@adins/ucgridfooter';
import { SharingComponentModule } from 'app/shared/sharingcomponent.module';
import { UclookupgenericModule } from '@adins/uclookupgeneric';
import { UcpagingModule } from '@adins/ucpaging';
import { UcSubsectionModule } from '@adins/uc-subsection';
import { FormModule } from 'app/forms/forms.module';
import { UcviewgenericModule } from '@adins/ucviewgeneric';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { UcShowErrorsModule } from '@adins/uc-show-errors';
import { AppSourceAddEditComponent } from './app-source/app-source-add-edit/app-source-add-edit.component';
import { AppSourcePagingComponent } from './app-source/app-source-paging/app-source-paging.component';
import { AppSourceOfficeMemberPagingComponent } from './app-source/app-source-office-member/app-source-office-member-paging/app-source-office-member-paging.component';
import { AppSourceOfficeMemberAddComponent } from './app-source/app-source-office-member/app-source-office-member-add/app-source-office-member-add.component';
import { UcaddressModule } from '@adins/ucaddress';
import { AdInsModule } from 'app/components/adins-module/adins.module';


@NgModule({
  imports: [
    SettingRoutingModule,
    CommonModule,
    FormsModule,
    HttpModule,
    NgbModule,
    UCSearchModule,
    UcgridfooterModule,
    SharingComponentModule,
    ReactiveFormsModule,
    FormModule,
    UcpagingModule,
    UclookupgenericModule,
    UcSubsectionModule,
    UcviewgenericModule,
    UcShowErrorsModule,
    UcSubsectionModule,
    UcaddressModule,
    AdInsModule
  ],
  declarations: [
    AppSourceAddEditComponent,
    AppSourcePagingComponent,
    AppSourceOfficeMemberPagingComponent,
    AppSourceOfficeMemberAddComponent
  ],
  providers: [
    NGXToastrService
  ]
})
export class SettingModule { }
