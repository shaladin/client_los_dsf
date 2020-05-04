import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { applicationViewComponent } from './application-view/application-view.component';
import { AgreementViewContainerComponent } from './agreement-view-container/agreement-view-container.component';
const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'AppView',
        component: applicationViewComponent,
        data: {
          title: 'Document'
        }
      },
      {
        path: 'AgrmntView',
        component: AgreementViewContainerComponent,
        data: {
          title: 'Agreement View'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NapViewRoutingModule { }
