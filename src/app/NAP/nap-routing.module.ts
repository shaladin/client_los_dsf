import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AppPagingComponent } from "./app-paging/app-paging.component";
import { AppAddComponent } from "./app-add/app-add.component";
import { AppAddDetailComponent } from "./app-add-detail/app-add-detail.component";
import { AppReferantorComponent } from "./App-Referantor/app-referantor/app-referantor.component";
import { CustomerDataComponent } from "./nap-tab/customer-data/customer-data.component";


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
                path: 'CustData',
                component: CustomerDataComponent,
                data: {
                    title: 'Customer Data'
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