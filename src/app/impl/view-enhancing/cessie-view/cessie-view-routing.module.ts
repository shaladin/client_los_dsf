import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CessieViewComponent } from './cessie-view.component';

const routes: Routes = [
    {
        path: '',
        component: CessieViewComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CessieViewRoutingModule { }


