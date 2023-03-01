import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PathConstant } from 'app/shared/constant/PathConstant';
import { RefFinAssetUsageMapAddEditComponent } from './ref-fin-asset-usage-map-add-edit/ref-fin-asset-usage-map-add-edit.component';
import { RefFinAssetUsageMapDetailAddComponent } from './ref-fin-asset-usage-map-detail-add/ref-fin-asset-usage-map-detail-add.component';
import { RefFinAssetUsageMapDetailComponent } from './ref-fin-asset-usage-map-detail/ref-fin-asset-usage-map-detail.component';
import { RefFinAssetUsageMapPagingComponent } from './ref-fin-asset-usage-map-paging/ref-fin-asset-usage-map-paging.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: PathConstant.REF_FIN_ASSET_USAGE_MAP_PAGING,
        component: RefFinAssetUsageMapPagingComponent,
        data: {
          title: 'Ref Fin Asset Usage Map Paging'
        }
      },
      {
        path: PathConstant.REF_FIN_ASSET_USAGE_MAP_ADD_EDIT,
        component: RefFinAssetUsageMapAddEditComponent,
        data: {
          title: 'Ref Fin Asset Usage Map Add Edit'
        }
      },
      {
        path: PathConstant.REF_FIN_ASSET_USAGE_MAP_DETAIL,
        component: RefFinAssetUsageMapDetailComponent,
        data: {
          title: 'Ref Fin Asset Usage Map Detail'
        }
      },
      {
        path: PathConstant.REF_FIN_ASSET_USAGE_MAP_DETAIL_ADD,
        component: RefFinAssetUsageMapDetailAddComponent,
        data: {
          title: 'Ref Fin Asset Usage Map Detail Add'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RefFinAssetUsageMapRoutingModule { }
