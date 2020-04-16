import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssetDataPagingComponent } from './asset-data-paging/asset-data-paging.component';
import { AssetDataAddEditComponent } from './asset-data-add-edit/asset-data-add-edit.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'Paging',
        component: AssetDataPagingComponent,
        data: {
          title: 'Asset Registration Summary'
        }
      },
      {
        path: 'Detail',
        component: AssetDataAddEditComponent,
        data: {
          title: 'Asset Registration Form'
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
