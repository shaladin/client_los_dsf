import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AgreementViewContainerComponent } from './agreement-view-container/agreement-view-container.component';
import { ApplicationViewComponent } from './application-view/application-view.component';
const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'AppView',
        component: ApplicationViewComponent,
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
