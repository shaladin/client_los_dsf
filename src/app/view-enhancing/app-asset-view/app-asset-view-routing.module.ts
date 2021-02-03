import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppAssetViewComponent } from './app-asset-view.component';

const routes: Routes = [
    {
        path: '',
        component: AppAssetViewComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AppAssetViewRoutingModule { }