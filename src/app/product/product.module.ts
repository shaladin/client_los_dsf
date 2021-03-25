import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { HoProdCompntComponent } from './product-ho/prod-ho-add-detail/ho-prod-compnt/ho-prod-compnt.component';
import { HoOfficeMbrComponent } from './product-ho/prod-ho-add-detail/ho-office-mbr/ho-office-mbr.component';
import { HoSearchOfficeComponent } from './product-ho/prod-ho-add-detail/ho-office-mbr/ho-search-office/ho-search-office.component';
import { HoListOfficeMbrComponent } from './product-ho/prod-ho-add-detail/ho-office-mbr/ho-list-office-mbr/ho-list-office-mbr.component';
import { HoGeneralDataComponent } from './product-ho/prod-ho-add-detail/ho-general-data/ho-general-data.component';
import { ProdHoPagingComponent } from './product-ho/prod-ho-paging/prod-ho-paging.component';
import { ProdHoAddComponent } from './product-ho/prod-ho-add/prod-ho-add.component';
import { ProdHoAddDetailComponent } from './product-ho/prod-ho-add-detail/prod-ho-add-detail.component';
import { ProdHoApvDetailComponent } from './product-ho/prod-ho-apv-detail/prod-ho-apv-detail.component';
import { ProdHoDeactApvDetailComponent } from './product-ho/prod-ho-deact-apv-detail/prod-ho-deact-apv-detail.component';
import { ProdHoDeactPagingComponent } from './product-ho/prod-ho-deact-paging/prod-ho-deact-paging.component';
import { ProdHoRvwPagingComponent } from './product-ho/prod-ho-rvw-paging/prod-ho-rvw-paging.component';
import { ProdHoDeactDetailComponent } from './product-ho/prod-ho-deact-detail/prod-ho-deact-detail.component';
import { ProdHoApvPagingComponent } from './product-ho/prod-ho-apv-paging/prod-ho-apv-paging.component';
import { ProdHoRvwDetailComponent } from './product-ho/prod-ho-rvw-detail/prod-ho-rvw-detail.component';
import { ProdOfferingAddComponent } from './product-offering/prod-offering-add/prod-offering-add.component';
import { ProdHoDeactApvPagingComponent } from './product-ho/prod-ho-deact-apv-paging/prod-ho-deact-apv-paging.component';
import { ProdOfferingPagingComponent } from './product-offering/prod-offering-paging/prod-offering-paging.component';
import { ProdOfferingRvwDetailComponent } from './product-offering/prod-offering-rvw-detail/prod-offering-rvw-detail.component';
import { ProdOfferingRvwPagingComponent } from './product-offering/prod-offering-rvw-paging/prod-offering-rvw-paging.component';
import { OfferingGeneralDataComponent } from './product-offering/prod-offering-add-detail/offering-general-data/offering-general-data.component';
import { OfferingListOfficeMbrComponent } from './product-offering/prod-offering-add-detail/offering-office-mbr/offering-list-office-mbr/offering-list-office-mbr.component';
import { OfferingProdCompntComponent } from './product-offering/prod-offering-add-detail/offering-prod-compnt/offering-prod-compnt.component';
import { OfferingOfficeMbrComponent } from './product-offering/prod-offering-add-detail/offering-office-mbr/offering-office-mbr.component';
import { ProdOfferingReturnPagingComponent } from './product-offering/prod-offering-return-paging/prod-offering-return-paging.component';
import { ProdHoReturnPagingComponent } from './product-ho/prod-ho-return-paging/prod-ho-return-paging.component';


@NgModule({
  declarations: [
    ProdHoPagingComponent, 
    ProdHoAddComponent, 
    ProdHoAddDetailComponent, 
    HoProdCompntComponent, 
    HoOfficeMbrComponent, 
    HoProdCompntComponent, 
    HoOfficeMbrComponent, 
    HoSearchOfficeComponent, 
    HoListOfficeMbrComponent, 
    HoGeneralDataComponent, 
    ProdHoApvDetailComponent, 
    ProdHoDeactApvDetailComponent, 
    ProdHoDeactPagingComponent, 
    ProdHoRvwPagingComponent, 
    ProdHoDeactDetailComponent, 
    ProdHoApvPagingComponent, 
    ProdHoRvwDetailComponent, 
    ProdOfferingAddComponent, 
    ProdHoDeactApvPagingComponent, 
    ProdOfferingPagingComponent, 
    ProdOfferingRvwDetailComponent, 
    ProdOfferingRvwPagingComponent, 
    OfferingGeneralDataComponent, 
    OfferingListOfficeMbrComponent, 
    OfferingProdCompntComponent, 
    OfferingOfficeMbrComponent, ProdOfferingReturnPagingComponent, ProdHoReturnPagingComponent],
  imports: [
    CommonModule,
    ProductRoutingModule
  ]
})
export class ProductModule { }
