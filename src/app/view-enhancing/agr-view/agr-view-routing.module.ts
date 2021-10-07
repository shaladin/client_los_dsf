import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AgreementViewContainerXComponent } from 'app/impl/view-enhancing/agr-view/agreement-view-container-x.component';
import { AgreementViewContainerComponent } from './agreement-view-container.component';
const routes: Routes = [
    {
        path: '',
        component: AgreementViewContainerComponent
    },
    {
        path: 'X',
        component: AgreementViewContainerXComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AgrViewRoutingModule { }


