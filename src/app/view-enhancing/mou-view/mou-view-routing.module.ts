import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MouViewComponent } from './mou-view.component';
const routes: Routes = [
    {
        path: '',
        component: MouViewComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MouViewRoutingModule { }


