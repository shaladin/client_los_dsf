import { NgModule } from '@angular/core';
import { GuarantorRoutingModule } from 'app/guarantor/guarantor-routing.module';
import { UcpagingModule } from '@adins/ucpaging';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UclookupgenericModule } from '@adins/uclookupgeneric';
import { SharingComponentModule } from "../shared/sharingcomponent.module";
import { HttpModule } from "@angular/http";
import { UcviewgenericModule } from "@adins/ucviewgeneric";
import { UCSearchModule } from '@adins/ucsearch';
import { UcgridfooterModule } from '@adins/ucgridfooter';
import { UcSubsectionModule } from '@adins/uc-subsection';
import { CommonModule } from '@angular/common';
import { PagingComponent } from 'app/guarantor/paging/paging.component';
import { AddPersonalComponent } from './add-personal/add-personal.component';
import { UcaddressModule } from "@adins/ucaddress";
import { UcgridviewModule} from '@adins/ucgridview';
import { MatRadioModule } from '@angular/material';
import { AddCompanyComponent } from './add-company/add-company.component';
import { CustUcaddressComponent } from "app/NAP/nap-tab/customer-data/component/address/ucaddress.component";
import { GuarantorComponent } from './guarantor.component';

@NgModule({
    imports: [
        GuarantorRoutingModule,
        UcpagingModule,
        ReactiveFormsModule,
        UclookupgenericModule,
        FormsModule,
        HttpModule,
        SharingComponentModule,
        UcviewgenericModule,
        UCSearchModule,
        UcgridfooterModule,
        UcSubsectionModule,
        CommonModule,
        UcgridviewModule,
        MatRadioModule,
        UcSubsectionModule,
        UcaddressModule
    ],
    declarations: [
        PagingComponent,
        AddPersonalComponent,
        AddCompanyComponent,
        CustUcaddressComponent,
        GuarantorComponent
    ]
  })

export class GuarantorModule { }
