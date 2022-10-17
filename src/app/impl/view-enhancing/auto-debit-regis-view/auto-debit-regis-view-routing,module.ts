import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AutoDebitRegistrationViewComponent } from 'app/impl/NEW-NAP/business-process/additional-process/auto-debit-registration/auto-debit-registration-view/auto-debit-registration-view.component';
const routes: Routes = [
    {
        path: '',
        component: AutoDebitRegistrationViewComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AutoDebitRegisViewRoutingModule { }


