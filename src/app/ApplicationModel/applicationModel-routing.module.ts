import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApplicationModelAddComponent } from './application-model-add/application-model-add.component';
const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'Save',
        component: ApplicationModelAddComponent,
        data: {
          title: 'App Model Save'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApplicationModelRoutingModule { }
