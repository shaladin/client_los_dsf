import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { FooterComponent } from "app/shared/footer/footer.component";
import { NavbarComponent } from "app/shared/navbar/navbar.component";
import { SidebarComponent } from "app/shared/sidebar/sidebar.component";
import { CustomizerComponent } from 'app/shared/customizer/customizer.component';
import { NotificationSidebarComponent } from 'app/shared/notification-sidebar/notification-sidebar.component';
import { ToggleFullscreenDirective } from "app/shared/directives/toggle-fullscreen.directive";
import { ContextMenuModule } from 'ngx-contextmenu';
import { DmsIframeComponent } from './dms-iframe/dms-iframe.component';
import { SafePipe } from './pipe/safepipe';
import { CookieModule } from 'ngx-cookie';


@NgModule({
    exports: [
        CommonModule,
        FooterComponent,
        NavbarComponent,
        SidebarComponent,
        CustomizerComponent,
        NotificationSidebarComponent,
        ToggleFullscreenDirective,
        NgbModule,
        TranslateModule,
        DmsIframeComponent,
        SafePipe
    ],
    imports: [
        RouterModule,
        CommonModule,
        NgbModule,
        TranslateModule,
        ContextMenuModule.forRoot(),
        CookieModule.forRoot()
    ],
    declarations: [
        FooterComponent,
        NavbarComponent,
        SidebarComponent,
        CustomizerComponent,
        NotificationSidebarComponent,
        ToggleFullscreenDirective,
        DmsIframeComponent,
        SafePipe,
    ]
})
export class SharedModule { }
