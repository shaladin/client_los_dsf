import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChangeMouViewComponent } from './change-mou-view.component';
import {ChangeMouViewXComponent} from 'app/impl/view-enhancing/change-mou-view/change-mou-view-x.component';

const routes: Routes = [
    {
        path: '',
        component: ChangeMouViewComponent
    },
    {
      path: 'X',
      component: ChangeMouViewXComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ChangeMouViewRoutingModule { }


