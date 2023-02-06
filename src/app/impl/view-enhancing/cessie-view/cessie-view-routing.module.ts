import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CessieViewComponent } from './cessie-view.component';
import { CessieSummaryDsfComponent } from 'app/dsf/impl/view-enhancing/cessie-view-dsf/cessie-summary-dsf/cessie-summary-dsf.component';

const routes: Routes = [
    {
        path: '',
        component: CessieViewComponent
    },
    {
        path: '',
        component: CessieSummaryDsfComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CessieViewRoutingModule { }


