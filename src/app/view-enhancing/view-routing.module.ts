import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SurveyViewModule } from './survey-view-prototype/survey-view.module';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'Dummy',
                // component: DocSignerComponent,
                data: {
                    title: 'Document'
                }
            },
            {
                path: 'AppView',
                loadChildren: './app-view/app-view.module#AppViewModule'
            },
            {
                path: 'AgrmntView',
                loadChildren: './agr-view/agr-view.module#AgrViewModule'
            },
            {
                path: 'POView',
                loadChildren: './purchase-order-view/purchase-order-view.module#POViewModule'
            },
            {
                path: 'Lead',
                loadChildren: './lead-view/lead-view.module#LeadViewModule'
            },
            {
                path: 'Mou/CustView',
                loadChildren: './mou-view/mou-view.module#MouViewModule'
            },
            {
                path: 'SurveyView',
                loadChildren: './survey-view-prototype/survey-view.module#SurveyViewModule'
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ViewRoutingModule { }
