import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PoExtensionPagingComponent } from '../NEW-NAP/sharing-component/additional-process-component/po-extension/po-extension-paging/po-extension-paging.component';
import { PoExtensionDetailComponent } from '../NEW-NAP/sharing-component/additional-process-component/po-extension/po-extension-detail/po-extension-detail.component';
import { OutstandingTcPagingComponent } from '../NEW-NAP/sharing-component/additional-process-component/outstanding-tc/outstanding-tc-paging/outstanding-tc-paging.component';
import { OutstandingTcDetailComponent } from '../NEW-NAP/sharing-component/additional-process-component/outstanding-tc/outstanding-tc-detail/outstanding-tc-detail.component';

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
      },
      {
        path: 'OutstandingTC/Paging',
        component: OutstandingTcPagingComponent,
        data: {
          title: 'Outstanding TC Paging'
        }
      },
      {
        path: 'OutstandingTC/Detail',
        component: OutstandingTcDetailComponent,
        data: {
          title: 'Outstanding TC Paging'
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
