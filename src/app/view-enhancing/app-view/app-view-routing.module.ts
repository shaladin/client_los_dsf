import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PathConstantX } from 'app/impl/shared/constant/PathConstantX';
import { AppViewXComponent } from 'app/impl/view-enhancing/app-view/app-view-x.component';
import { AppViewComponent } from './app-view.component';
const routes: Routes = [
    {
        path: '',
        component: AppViewComponent
    },
    {
        path: PathConstantX.X,
        component: AppViewXComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AppViewRoutingModule { }


