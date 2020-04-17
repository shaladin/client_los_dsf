import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AppTcComponent } from "./nap-tab/app-tc/app-tc.component";
import { AppFinDataComponent } from "./nap-tab/app-fin-data/app-fin-data.component";
import { PhnVerifPagingComponent } from "./phone-verif/phone-verif-paging/phone-verif-paging.component";
import { VerfQuestionComponent } from "./nap-component/verf-question/verf-question.component";
import { PhnVerifSubjectComponent } from "./phone-verif/phone-verif-subject/phone-verif-subject.component";
import { PhnVerifSubjectViewComponent } from "./phone-verif/phone-verif-subject-view/phone-verif-subject-view.component";
import { PhnVerifSubjectVerifComponent } from "./phone-verif/phone-verif-subject-verif/phone-verif-subject-verif.component";
import { AppFromLeadPagingComponent } from "./app-from-lead/paging/app-from-lead-paging.component";
import { AppFromLeadDetailComponent } from "./app-from-lead/detail/app-from-lead-detail.component";


const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'AppTC',
                component: AppTcComponent,
                data: {
                    title: 'APP TC'
                },
            },
            {
                path: 'AppFinData',
                component: AppFinDataComponent,
                data: {
                    title: 'Commission Add'
                }
            },
            {
                path: 'PhoneVerif',
                component: PhnVerifPagingComponent,
                data: {
                    title: 'Phone Verif Paging'
                }
            },
            {
                path: 'VerfQuestion',
                component: VerfQuestionComponent,
                data: {
                    title: 'Verification Question'
                }
            },

            {
                path: 'PhoneVerif/Subject',
                component: PhnVerifSubjectComponent,
                data: {
                    title: 'Phone Verif Subject View'
                }
            },
            {
                path: 'PhoneVerif/Subject/View',
                component: PhnVerifSubjectViewComponent,
                data: {
                    title: 'Phone Verif Subject View Detail'
                }
            },
            {
                path: 'PhoneVerif/Subject/Verif',
                component: PhnVerifSubjectVerifComponent,
                data: {
                    title: 'Phone Verif Subject Verif Detail'
                }
            },
            {
                path: 'AppFromLead/Paging',
                component: AppFromLeadPagingComponent,
                data: {
                    title: 'Paging'
                }
            },
            {
                path: 'AppFromLead/Detail',
                component: AppFromLeadDetailComponent,
                data: {
                    title: 'Detail'
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
