import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppViewComponent } from './app-view.component';
const routes: Routes = [
    {
        path: '',
        component: AppViewComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AppViewRoutingModule { }


