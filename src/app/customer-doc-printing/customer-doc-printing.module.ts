import { CommonModule } from "@angular/common";
import { CustomerDocPrintingDetailComponent } from "./customer-doc-printing-detail/customer-doc-printing-detail.component";
import { CustomerDocPrintingPagingComponent } from "./customer-doc-printing-paging/customer-doc-printing-paging.component";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { UcgridfooterModule } from "@adins/ucgridfooter";
import { CustomerDocPrintingRoutingComponent } from "./customer-doc-printing-routing.module";
import { NgModule } from "@angular/core";
// import { UCSearchModule } from "@adins/ucsearch";
// import { UcpagingModule } from "@adins/ucpaging";

@NgModule({
    imports:[
        CustomerDocPrintingRoutingComponent,
        CommonModule,
        FormsModule,
        HttpModule,
        // UCSearchModule,
        UcgridfooterModule,
        // UcpagingModule,
    ],
    declarations:[
        CustomerDocPrintingDetailComponent,
        CustomerDocPrintingPagingComponent
    ]
})

export class CustomerDocPrintingModule { }