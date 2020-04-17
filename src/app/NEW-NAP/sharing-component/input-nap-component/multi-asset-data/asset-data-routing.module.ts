import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssetDataPagingComponent } from './asset-data-paging/asset-data-paging.component';
import { AssetDataAddEditComponent } from './asset-data-add-edit/asset-data-add-edit.component';
import { CollateralAddEditComponent } from './collateral-add-edit/collateral-add-edit.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'AssetData/Paging',
        component: AssetDataPagingComponent,
        data: {
          title: 'Asset Registration Summary'
        }
      },
      {
        path: 'AssetData/Detail',
        component: AssetDataAddEditComponent,
        data: {
          title: 'Asset Registration Form'
        }
      },
      {
        path: 'Collateral/Detail',
        component: CollateralAddEditComponent,
        data: {
          title: 'Collateral Registration Form'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssetDataFL4WRoutingModule { }
