import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CrdRvwViewComponent } from './crd-rvw-view.component';
const routes: Routes = [
    {
        path: '',
        component: CrdRvwViewComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CrdRvwViewRoutingModule { }


