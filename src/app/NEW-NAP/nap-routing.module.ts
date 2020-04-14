import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'ConsumerFinance/InputNap',
                loadChildren: './CF4W/input-nap/input-nap.module#InputNapCF4WModule'
            },
            {
                path: 'ConsumerFinance/CreditProcess',
                loadChildren: './CF4W/credit-process/credit-process.module#CreditProcessCF4WModule'
            },
            {
                path: 'ConsumerFinance/AdminProcess',
                loadChildren: './CF4W/admin-process/admin-process.module#AdminProcessCF4WModule'
            },
            {
                path: 'ConsumerFinance/AddProcess',
                loadChildren: './CF4W/additional-process/additional-process.module#AdditionalProcessCF4WModule'
            },
            {
                path: 'FinanceLeasing/InputNap',
                loadChildren: './FL4W/input-nap/input-nap.module#InputNapFL4WModule'
            },
            {
                path: 'FinanceLeasing/CreditProcess',
                loadChildren: './FL4W/credit-process/credit-process.module#CreditProcessFL4WModule'
            },
            {
                path: 'FinanceLeasing/AdminProcess',
                loadChildren: './FL4W/admin-process/admin-process.module#AdminProcessFL4WModule'
            },
            {
                path: 'FinanceLeasing/AddProcess',
                loadChildren: './FL4W/additional-process/additional-process.module#AdditionalProcessFL4WModule'
            },
            {
                path: 'CFRefinancing/InputNap',
                loadChildren: './RFN4W/input-nap/input-nap.module#InputNapRFN4WModule'
            },
            {
                path: 'CFRefinancing/CreditProcess',
                loadChildren: './RFN4W/credit-process/credit-process.module#CreditProcessRFN4WModule'
            },
            {
                path: 'CFRefinancing/AdminProcess',
                loadChildren: './RFN4W/admin-process/admin-process.module#AdminProcessRFN4WModule'
            },
            {
                path: 'CFRefinancing/AddProcess',
                loadChildren: './RFN4W/additional-process/additional-process.module#AdditionalProcessRFN4WModule'
            },
            {
                path: 'Factoring/InputNap',
                loadChildren: './FCTR/input-nap/input-nap.module#InputNapFCTRModule'
            },
            {
                path: 'Factoring/CreditProcess',
                loadChildren: './FCTR/credit-process/credit-process.module#CreditProcessFCTRModule'
            },
            {
                path: 'Factoring/AdminProcess',
                loadChildren: './FCTR/admin-process/admin-process.module#AdminProcessFCTRModule'
            },
            {
                path: 'Factoring/AddProcess',
                loadChildren: './FCTR/additional-process/additional-process.module#AdditionalProcessFCTRModule'
            },
        ]
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class NapRoutingModule { }
