import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CrdRvwViewComponent } from './crd-rvw-view.component';
import { CrdRvwViewXComponent } from 'app/impl/view-enhancing/crd-rvw-view/crd-rvw-view-x.component';
const routes: Routes = [
    {
        path: '',
        component: CrdRvwViewComponent
    },
    {
        path: 'X',
        component: CrdRvwViewXComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CrdRvwViewRoutingModule { }


