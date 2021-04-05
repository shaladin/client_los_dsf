import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppListViewComponent } from "./app-list-view.component";

const routes: Routes = [
    {
        path: '',
        component: AppListViewComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AppListViewRoutingModule { }