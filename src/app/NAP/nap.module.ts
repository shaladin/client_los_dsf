import { AppAddComponent } from "./app-add/app-add.component";
import { AppPagingComponent } from "./app-paging/app-paging.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ArchwizardModule } from "angular-archwizard";
import { UcpagingModule } from "@adins/ucpaging";
import { UcviewgenericModule } from "@adins/ucviewgeneric";
import { UclookupgenericModule } from "@adins/uclookupgeneric";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { NapRoutingModule } from "./nap-routing.module";
import { RouterModule } from "@angular/router";
import { AppAddDetailComponent } from './app-add-detail/app-add-detail.component';
import { MatCheckboxModule } from "@angular/material";
import { AppReferantorComponent } from "./nap-tab/app-referantor/app-referantor.component";
import { AppModelComponent } from './nap-tab/app-model/app-model.component';
import { CustomerDataComponent } from "./nap-tab/customer-data/customer-data.component";
import { MatRadioModule } from "@angular/material";
import { UcSubsectionModule } from "@adins/uc-subsection";
import { UcaddressModule } from "@adins/ucaddress";
import { UcgridviewModule } from "@adins/ucgridview";
import { SharingComponentModule } from "app/shared/sharingcomponent.module";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { CustPersonalMainDataComponent } from "./nap-tab/customer-data/component/personal-main-data/cust-personal-main-data.component";
import { CustUcaddressComponent } from "./nap-tab/customer-data/component/address/ucaddress.component";
import { CustContactInformationComponent } from "./nap-tab/customer-data/component/contact-information/cust-contact-information.component";
import { CustFinancialDataComponent } from "./nap-tab/customer-data/component/financial-data/cust-financial-data.component";
import { CustBankAccountComponent } from "./nap-tab/customer-data/component/bank-account/cust-bank-account.component";
import { CustJobDataComponent } from "./nap-tab/customer-data/component/job-data/cust-job-data.component";
import { CustSocmedComponent } from "./nap-tab/customer-data/component/socmed/cust-socmed.component";
import { CustGrpMemberComponent } from "./nap-tab/customer-data/component/cust-grp-member/cust-grp-member.component";
import { CustCompanyMainDataComponent } from "./nap-tab/customer-data/component/company-main-data/cust-company-main-data.component";
import { AssetDataComponent } from "./nap-tab/asset-data/asset-data.component";



@NgModule({
  declarations: [
    AppAddComponent,
    AppPagingComponent,
    AppAddDetailComponent,
    AppReferantorComponent,
    CustomerDataComponent,
    CustUcaddressComponent,
    AppModelComponent,
    CustomerDataComponent,
    CustPersonalMainDataComponent,
    CustUcaddressComponent,
    CustContactInformationComponent,
    CustFinancialDataComponent,
    CustBankAccountComponent,
    CustJobDataComponent,
    CustSocmedComponent,
    CustGrpMemberComponent,
    CustCompanyMainDataComponent,
    AssetDataComponent
  ],
  imports: [
    NapRoutingModule,
    CommonModule,
    ArchwizardModule,
    UcpagingModule,
    UcviewgenericModule,
    UclookupgenericModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    CommonModule,
    RouterModule,
    MatCheckboxModule,
    MatRadioModule,
    UcSubsectionModule,
    SharingComponentModule,
    UcaddressModule,
    UcgridviewModule
  ],
  exports: [],
  providers: [NGXToastrService],
})

export class NapModule { }
