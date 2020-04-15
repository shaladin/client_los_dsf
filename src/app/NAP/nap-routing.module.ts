import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AppPagingComponent } from "./app-paging/app-paging.component";
import { AppAddComponent } from "./app-add/app-add.component";
import { AppAddDetailComponent } from "./app-add-detail/app-add-detail.component";
import { AppReferantorComponent } from "./nap-tab/app-referantor/app-referantor.component";
import { AppModelComponent } from "./nap-tab/app-model/app-model.component";
import { CustomerDataComponent } from "./nap-tab/customer-data/customer-data.component";
import { AppGuarantorComponent } from "./nap-tab/app-guarantor/app-guarantor.component";
import { GuarantorCompanyComponent } from "./nap-tab/app-guarantor/guarantor-company/guarantor-company.component";
import { GuarantorPagingComponent } from "./nap-tab/app-guarantor/guarantor-paging/guarantor-paging.component";
import { GuarantorPersonalComponent } from "./nap-tab/app-guarantor/guarantor-personal/guarantor-personal.component";
import { AppLifeInsComponent } from "./nap-tab/app-life-ins/app-life-ins.component";
import { AppTcComponent } from "./nap-tab/app-tc/app-tc.component";
import { AppFinDataComponent } from "./nap-tab/app-fin-data/app-fin-data.component";
import { InsuranceDataComponent } from "./nap-tab/insurance-data/insurance-data.component";
import { AssetDataComponent } from "./nap-tab/asset-data/asset-data.component";
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
                path: 'AppPaging',
                component: AppPagingComponent,
                data: {
                    title: 'Paging'
                }
            },
            {
                path: 'AppAdd',
                component: AppAddComponent,
                data: {
                    title: 'Add'
                }
            },
            {
                path: 'AppAddDetail',
                component: AppAddDetailComponent,
                data: {
                    title: 'AddDetail'
                }
            },
            {
                path: 'AppReferantor',
                component: AppReferantorComponent,
                data: {
                    title: 'Referantor'
                }
            },
            {
                path: 'AppModel',
                component: AppModelComponent,
                data: {
                    title: 'Model'
                }
            },
            {
                path: 'CustData',
                component: CustomerDataComponent,
                data: {
                    title: 'Customer Data'
                }
            },
            {
                path: 'InsuranceData',
                component: InsuranceDataComponent,
                data: {
                    title: 'Insurance Data'
                }
            },
            {
                path: 'Guarantor/paging',
                component: GuarantorPagingComponent,
                data: {
                    title: 'Paging'
                },
            },
            {
                path: 'LifeIns',
                component: AppLifeInsComponent,
                data: {
                    title: 'Life Insurance'
                },
            },
            {
                path: 'AppTC',
                component: AppTcComponent,
                data: {
                    title: 'APP TC'
                },
            },
            {
                path: 'AssetData',
                component: AssetDataComponent,
                data: {
                    title: 'Asset Data'
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
