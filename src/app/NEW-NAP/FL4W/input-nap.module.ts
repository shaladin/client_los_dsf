import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { DummyComponent } from './dummy/dummy.component';
import { AdInsModule } from "app/components/adins-module/adins.module";
import { InputNapFL4WRoutingModule } from "./input-nap-routing.module";
import { ArchwizardModule } from "angular-archwizard";
import { InputNapComponentModule } from "app/NEW-NAP/sharing-component/input-nap-component/input-nap-component.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ReactiveFormsModule, FormsModule } from "@angular/forms"; 
import { UcShowErrorsModule } from "@adins/uc-show-errors"; 
import { UcinputnumberModule } from "@adins/ucinputnumber"; 
import { NapAddComponent } from './nap-add/nap-add.component';
import { NapPagingComponent } from './nap-paging/nap-paging.component';
import { NapViewComponent } from './nap-view/nap-view.component';   
import { MatCheckboxModule, MatRadioModule, MatSelectModule, MatTabsModule } from "@angular/material";
import { NgxCurrencyModule } from "ngx-currency";
import { customCurrencyMaskConfig } from "app/MOU/mou.module"; 
import { NapAddDetailComponent } from './nap-add-detail/nap-add-detail.component';
import { NapTabComponentModule } from "./nap-tab/nap-tab.module";
import { ViewMainInfoComponentModule } from "../sharing-component/view-main-info-component/view-main-info-component.module";
import { ViewAppComponentModule } from "../sharing-component/view-app-component/view-app-component.module";
import { AppMainInfoComponent } from "../sharing-component/view-main-info-component/app-main-info/app-main-info.component";
import { ViewAppCustDataPersonalComponent } from "../sharing-component/view-app-component/view-app-cust-data-personal/view-app-cust-data-personal.component";
import { ViewAppCustDataCompanyComponent } from "../sharing-component/view-app-component/view-app-cust-data-company/view-app-cust-data-company.component";
import { ViewAgrmntComponent } from './view-agrmnt/view-agrmnt.component';
import { ViewAgrmntReservedFundComponent } from "../sharing-component/view-agrmnt-component/view-reserved-fund/view-reserved-fund.component";

@NgModule({
  imports: [
    CommonModule,
    InputNapFL4WRoutingModule,
    AdInsModule,
    InputNapComponentModule,
    ArchwizardModule,
    UcShowErrorsModule,
    NgbModule, 
    ReactiveFormsModule,
    FormsModule, 
    UcinputnumberModule, 
    MatCheckboxModule,
    MatRadioModule,
    MatSelectModule,
    NapTabComponentModule,
    MatTabsModule,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig)
  ],
  declarations: [
    DummyComponent, 
    NapAddComponent,
    NapPagingComponent,
    NapViewComponent,  
    NapAddDetailComponent, 
    AppMainInfoComponent,
    ViewAppCustDataPersonalComponent,
    ViewAppCustDataCompanyComponent,
    ViewAgrmntComponent,
    ViewAgrmntReservedFundComponent
  ],
  providers: [
    NGXToastrService
  ] 
})
export class InputNapFL4WModule { }