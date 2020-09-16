import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AgreementViewContainerComponent } from './agreement-view-container.component';


const routes: Routes = [
    {
        path: '',
        component: AgreementViewContainerComponent,
        children: [
            {
                path: '',
                loadChildren: './agreement-view-child.module#AgreementViewChildModule'
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AgreementViewContainerRoutingModule { }


