import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';  
import { AppComponent } from './app/app.component';
 

const routes: Routes = [
  {
    path: '',
    children: [ 
        {
            path: 'App',
            component: AppComponent,
            data: {
                title: 'Paging'
            }
        },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InputNapCF2WRoutingModule { }
