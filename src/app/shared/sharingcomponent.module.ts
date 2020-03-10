
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { LookupCountryComponent } from './lookup/lookup-country/lookup-country.component';
import { LookupCustomerComponent } from './lookup/lookup-customer/lookup-customer.component';
import { LookupProfessionComponent } from './lookup/lookup-profession/lookup-profession.component';
import { UcSubsectionModule } from '@adins/uc-subsection';
import { UcgridfooterModule } from '@adins/ucgridfooter';
import { AddressComponent } from './address/address.component';
import { LookupCustomerGroupComponent } from './lookup/lookup-customer-group/lookup-customer-group.component';
import { LookupIndustryTypeComponent } from './lookup/lookup-industry-type/lookup-industry-type.component';
import { LookupZipcodeComponent } from './lookup/lookup-zipcode/lookup-zipcode.component';
import { LookupSupplierComponent } from './lookup/lookup-supplier/lookup-supplier.component';
import { LookupAssetComponent } from './lookup/lookup-asset/lookup-asset.component';
import { LookupBpkbCityComponent } from './lookup/lookup-bpkb-city/lookup-bpkb-city.component';
import { LookupAccessoriesComponent } from './lookup/lookup-accessories/lookup-accessories.component';
import { LookupAgencyComponent } from './lookup/lookup-agency/lookup-agency.component';


@NgModule({
    exports: [
        LookupCountryComponent,
        LookupCustomerComponent,
        LookupProfessionComponent,
        AddressComponent,
        LookupCustomerGroupComponent,
        LookupIndustryTypeComponent,
        LookupZipcodeComponent,
        LookupSupplierComponent,
        LookupAssetComponent,
        LookupBpkbCityComponent,
        LookupAccessoriesComponent,
        LookupAgencyComponent
    ],
    imports: [
        FormsModule,
        NgbModule,
        RouterModule,
        HttpModule,
        CommonModule,
        UcSubsectionModule,
        UcgridfooterModule
    ],
    declarations: [
        LookupCountryComponent,
        LookupCustomerComponent,
        LookupProfessionComponent,
        AddressComponent,
        LookupCustomerGroupComponent,
        LookupIndustryTypeComponent,
        LookupZipcodeComponent,
        LookupSupplierComponent,
        LookupAssetComponent,
        LookupBpkbCityComponent,
        LookupAccessoriesComponent,
        LookupAgencyComponent
    ]
})

export class SharingComponentModule { }
