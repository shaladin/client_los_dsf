import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SurveyViewComponent } from './survey-view.component';
const routes: Routes = [
    {
        path: '',
        component: SurveyViewComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SurveyViewRoutingModule { }


