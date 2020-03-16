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
import { UcgridviewModule} from '@adins/ucgridview';

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
        UcgridviewModule
    ],
    declarations: [
        PagingComponent,
        AddPersonalComponent,
    ]
  })

export class GuarantorModule { }
