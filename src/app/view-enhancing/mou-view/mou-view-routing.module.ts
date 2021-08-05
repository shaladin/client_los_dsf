import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MouViewComponent } from './mou-view.component';
import {MouViewXComponent} from 'app/impl/view-enhancing/mou-view/mou-view-x.component';
const routes: Routes = [
    {
        path: '',
        component: MouViewComponent
    },
    {
      path: 'X',
      component: MouViewXComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MouViewRoutingModule { }


