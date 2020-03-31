import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PoExtensionPagingComponent } from './po-extension/po-extension-paging/po-extension-paging.component';
import { PoExtensionDetailComponent } from './po-extension/po-extension-detail/po-extension-detail.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'POExtension/Paging',
        component: PoExtensionPagingComponent,
        data: {
          title: 'PO Extension Paging'
        }
      },
      {
        path: 'POExtension/Detail',
        component: PoExtensionDetailComponent,
        data: {
          title: 'PO Extension Detail'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddProcessRoutingModule { }
