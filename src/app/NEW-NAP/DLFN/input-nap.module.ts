import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NapPagingComponent } from './nap-paging/nap-paging.component';
import { InputNapDLFNRoutingModule } from './input-nap-routing.module';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { NapAddComponent } from './nap-add/nap-add.component';
import { NapAddDetailComponent } from './nap-add-detail/nap-add-detail.component';
import { NapCustMainDataComponent } from './nap-cust-main-data/nap-cust-main-data.component';
import { NapDetailFormComponent } from './nap-detail-form/nap-detail-form.component';
import { AdInsModule } from 'app/components/adins-module/adins.module';
// import { InputNapComponentModule } from '../sharing-component/input-nap-component/input-nap-component.module';
import { InputNapComponentModule } from 'app/NEW-NAP/sharing-component/input-nap-component/input-nap-component.module';
import { ArchwizardModule } from 'angular-archwizard';
import { MainDataComponentModule } from '../sharing-component/main-data-component/main-data-component.module';
import { NapDetailFormDsfComponent } from '../DSF/DLFN-dsf/nap-detail-form-dsf/nap-detail-form-dsf.component';
import { NapCustMainDataDsfComponent } from '../DSF/DLFN-dsf/nap-cust-main-data-dsf/nap-cust-main-data-dsf.component';
import { SharedModule } from 'app/shared/shared.module';
import { NapDetailFormXComponent } from 'app/impl/NEW-NAP/DLFN/nap-detail-form/nap-detail-form-x.component';
import { NapCustMainDataXComponent } from 'app/impl/NEW-NAP/DLFN/nap-cust-main-data/nap-cust-main-data-x.component';
import { MatRadioModule } from '@angular/material';

@NgModule({
  declarations: [
    NapPagingComponent,
    NapAddComponent,
    NapAddDetailComponent,
    NapCustMainDataComponent,
    NapDetailFormComponent,
    NapDetailFormXComponent,
    NapCustMainDataXComponent,
    NapCustMainDataDsfComponent,
    NapDetailFormDsfComponent
  ],
  imports: [
    CommonModule,
    InputNapDLFNRoutingModule,
    AdInsModule,
    InputNapComponentModule,
    ArchwizardModule,
    MainDataComponentModule,
    SharedModule,
    MatRadioModule,
  ],
  providers: [
    NGXToastrService
  ]
})
export class InputNapDLFNModule { }
