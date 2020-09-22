import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LeadViewComponent } from './lead-view.component';
const routes: Routes = [
    {
        path: '',
        component: LeadViewComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class LeadViewRoutingModule { }


