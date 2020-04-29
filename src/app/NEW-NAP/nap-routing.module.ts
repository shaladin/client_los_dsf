import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'ConsumerFinance',
                loadChildren: './CF4W/input-nap.module#InputNapCF4WModule'
            },
            {
                path: 'FinanceLeasing',
                loadChildren: './FL4W/input-nap.module#InputNapFL4WModule'
            },
            {
                path: 'CF2W',
                loadChildren: './CF2W/input-nap.module#InputNapCF2WModule'
            },
            {
                path: 'CFRefinancing',
                loadChildren: './RFN4W/input-nap.module#InputNapRFN4WModule'
            },
            {
                path: 'Factoring',
                loadChildren: './FCTR/input-nap.module#InputNapFCTRModule'
            },
            {
                path: 'AdditionalProcess',
                loadChildren: './business-process/additional-process/additional-process.module#AdditionalProcessSharingModule'
            },
            {
                path: 'CreditProcess',
                loadChildren: './business-process/credit-process/credit-process.module#CreditProcessSharingModule'
            },
            {
                path: 'AdminProcess',
                loadChildren: './business-process/admin-process/admin-process.module#AdminProcessSharingModule'
            },
            {
                path: 'AddProcess',
                loadChildren: './business-process/additional-process/additional-process.module#AdditionalProcessSharingModule'
            },
            {
                path: 'View',
                loadChildren: './view/nap-view.module#NapViewModule'
            }
        ]
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class NapRoutingModule { }
