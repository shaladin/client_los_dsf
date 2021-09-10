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
//import { InputNapComponentModule } from '../sharing-component/input-nap-component/input-nap-component.module';
import { InputNapComponentModule } from "app/NEW-NAP/sharing-component/input-nap-component/input-nap-component.module";
import { ArchwizardModule } from 'angular-archwizard';
import { MainDataComponentModule } from '../sharing-component/main-data-component/main-data-component.module';
import {SharedModule} from 'app/shared/shared.module';
import {NapDetailFormXComponent} from 'app/impl/NEW-NAP/DLFN/nap-detail-form/nap-detail-form-x.component';
import {ApplicationDataDlfnXComponent} from 'app/impl/NEW-NAP/sharing-component/input-nap-component/application-data/application-data-dlfn/application-data-dlfn-x.component';
import {FinancialDataDlfnXComponent} from 'app/impl/NEW-NAP/sharing-component/input-nap-component/financial-data-dlfn/financial-data-dlfn-x.component';
import {SingleInstDlfnXComponent} from 'app/impl/NEW-NAP/sharing-component/input-nap-component/financial-data-dlfn/component/single-inst-dlfn/single-inst-dlfn-x.component';
import {SchmRegularFixDlfnXComponent} from 'app/impl/NEW-NAP/sharing-component/input-nap-component/financial-data-dlfn/component/multi-inst/schm-regular-fix-dlfn/schm-regular-fix-dlfn-x.component';
import {SchmEvenPrincipalDlfnXComponent} from 'app/impl/NEW-NAP/sharing-component/input-nap-component/financial-data-dlfn/component/multi-inst/schm-even-principal-dlfn/schm-even-principal-dlfn-x.component';
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
    ApplicationDataDlfnXComponent,
    FinancialDataDlfnXComponent,
    SingleInstDlfnXComponent,
    SchmRegularFixDlfnXComponent,
    SchmEvenPrincipalDlfnXComponent,
    NapCustMainDataXComponent
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
