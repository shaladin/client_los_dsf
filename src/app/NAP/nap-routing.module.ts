import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { VerfQuestionComponent } from "./nap-component/verf-question/verf-question.component";


const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'VerfQuestion',
                component: VerfQuestionComponent,
                data: {
                    title: 'Verification Question'
                }
            },
        ]
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class NapRoutingModule { }
