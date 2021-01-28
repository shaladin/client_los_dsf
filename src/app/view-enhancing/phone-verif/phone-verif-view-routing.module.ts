import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PhoneVerifComponent } from './phone-verif.component';
const routes: Routes = [
    {
        path: '',
        component: PhoneVerifComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PhoneVerifViewRoutingModule { }


