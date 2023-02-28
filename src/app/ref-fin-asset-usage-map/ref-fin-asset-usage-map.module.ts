import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RefFinAssetUsageMapRoutingModule } from './ref-fin-asset-usage-map-routing.module';
import { AdInsModule } from 'app/components/adins-module/adins.module';
import { AdInsSharedModule } from 'app/components/adins-module/adIns-shared.module';
import { UcaddtotempModule } from '@adins/ucaddtotemp';
import { SharingComponentModule } from 'app/shared/sharingcomponent.module';
import { RefFinAssetUsageMapPagingComponent } from './ref-fin-asset-usage-map-paging/ref-fin-asset-usage-map-paging.component';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { RefFinAssetUsageMapDetailComponent } from './ref-fin-asset-usage-map-detail/ref-fin-asset-usage-map-detail.component';
import { RefFinAssetUsageMapAddEditComponent } from './ref-fin-asset-usage-map-add-edit/ref-fin-asset-usage-map-add-edit.component';
import { RefFinAssetUsageMapDetailAddComponent } from './ref-fin-asset-usage-map-detail-add/ref-fin-asset-usage-map-detail-add.component';

@NgModule({
  imports: [
    CommonModule,
    RefFinAssetUsageMapRoutingModule,
    AdInsModule,
    AdInsSharedModule,
    SharingComponentModule,
    UcaddtotempModule,
  ],
  declarations: [
    RefFinAssetUsageMapPagingComponent,
    RefFinAssetUsageMapDetailComponent,
    RefFinAssetUsageMapAddEditComponent,
    RefFinAssetUsageMapDetailAddComponent
  ],
  exports: [],
  providers: [NGXToastrService],
  entryComponents: [
  ]
})
export class RefFinAssetUsageMapModule { }