import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AgreementViewContainerComponent } from './agreement-view-container.component';
const routes: Routes = [
    {
        path: '',
        component: AgreementViewContainerComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AgrViewRoutingModule { }


