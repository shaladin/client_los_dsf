import { CustomerDocPrintingPagingComponent } from "./customer-doc-printing-paging/customer-doc-printing-paging.component";
import { CustomerDocPrintingDetailComponent } from "./customer-doc-printing-detail/customer-doc-printing-detail.component";
import { Routes, RouterModule } from "@angular/router";
import { NgModule } from '@angular/core';
const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'Paging',
                component: CustomerDocPrintingPagingComponent,
                data: {
                    title: 'MOU Customer Doc Paging'
                }
            },
            {
                path: 'Detail',
                component: CustomerDocPrintingDetailComponent,
                data: {
                    title: 'MOU Customer Doc Detail'
                }
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
  })
  export class CustomerDocPrintingRoutingComponent { }