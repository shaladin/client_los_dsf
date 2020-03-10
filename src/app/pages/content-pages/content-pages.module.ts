import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';

import { ContentPagesRoutingModule } from "app/pages/content-pages/content-pages-routing.module";
import { LoginPageComponent } from "app/pages/content-pages/login/login-page.component";


@NgModule({
    imports: [
        CommonModule,
        ContentPagesRoutingModule,
        FormsModule        
    ],
    declarations: [
        LoginPageComponent
    ]
})
export class ContentPagesModule { }
