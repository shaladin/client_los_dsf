import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
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
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NapViewRoutingModule { }
