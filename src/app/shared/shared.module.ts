import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { FooterComponent } from "app/shared/footer/footer.component";
import { NavbarComponent } from "app/shared/navbar/navbar.component";
import { SidebarComponent } from "app/shared/sidebar/sidebar.component";
import { CustomizerComponent } from 'app/shared/customizer/customizer.component';
import { NotificationSidebarComponent } from 'app/shared/notification-sidebar/notification-sidebar.component';
import { ToggleFullscreenDirective } from "app/shared/directives/toggle-fullscreen.directive";
import { ContextMenuModule } from 'ngx-contextmenu';
import { DmsIframeComponent } from './dms-iframe/dms-iframe.component';
import { AppModule } from 'app/app.module';
import { SafePipe } from './pipe/safepipe';
import { CookieModule } from 'ngx-cookie';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
  }

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
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            }
        }),
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
