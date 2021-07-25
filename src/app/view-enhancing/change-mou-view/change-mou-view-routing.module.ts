import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChangeMouViewComponent } from './change-mou-view.component';

const routes: Routes = [
    {
        path: '',
        component: ChangeMouViewComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ChangeMouViewRoutingModule { }


