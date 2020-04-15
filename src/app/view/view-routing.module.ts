import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppViewComponent } from './app-view/app-view.component';
const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'Dummy',
        // component: DocSignerComponent,
        data: {
          title: 'Document'
        }
      },
      {
        path: 'AppView',
        component: AppViewComponent,
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
export class ViewRoutingModule { }
