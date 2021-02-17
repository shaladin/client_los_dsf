
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from 'app/app-routing.module';
import { SharedModule } from "app/shared/shared.module";
import { ToastrModule } from 'ngx-toastr';
import { AgmCoreModule } from '@agm/core';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { StoreModule } from '@ngrx/store';
import { DragulaModule } from 'ng2-dragula';

import { AppComponent } from 'app/app.component';
import { ContentLayoutComponent } from "app/layouts/content/content-layout.component";
import { FullLayoutComponent } from "app/layouts/full/full-layout.component";

import { AuthService } from 'app/shared/auth/auth.service';
import { AuthGuard } from 'app/shared/auth/auth-guard.service';
import { StorageServiceModule } from 'angular-webstorage-service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatDialogModule } from '@angular/material';

import { HttpModule } from '@angular/http';
import { HttpConfigInterceptor } from 'app/interceptor/httpconfig.interceptor';
import { ErrorDialogService } from 'app/error-dialog/error-dialog.service';
import { ErrorDialogComponent } from 'app/error-dialog/error-dialog.component';
import { RolepickComponent } from 'app/shared/rolepick/rolepick.component';
import { RolePickService } from 'app/shared/rolepick/rolepick.service';
import { GrowlModule } from 'primeng/primeng';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { BackdoorComponent } from './backdoor/backdoor.component';
import { CookieModule } from 'ngx-cookie';

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    declarations: [
        AppComponent,
        FullLayoutComponent,
        ContentLayoutComponent,
        ErrorDialogComponent,
        RolepickComponent,
        BackdoorComponent
        ],
    
    imports: [
        HttpModule,
        BrowserAnimationsModule,
        StoreModule.forRoot({}),
        AppRoutingModule,
        NgxSpinnerModule,
        SharedModule,
        DragulaModule.forRoot(),
        HttpClientModule,
        ToastrModule.forRoot(),
        NgbModule.forRoot(),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            }
        }),
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyBr5_picK8YJK7fFR2CPzTVMj6GG1TtRGo'
        }),
        CookieModule.forRoot({ path: "", secure: true, httpOnly: false, sameSite: "strict" }),
        StorageServiceModule,
        MatDialogModule,
        BrowserAnimationsModule,
        GrowlModule,
        TreeViewModule
    ],
    providers: [
        AuthService,
        AuthGuard,
        ErrorDialogService,
        RolePickService,
        { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true }
    ],
    bootstrap: [AppComponent],
    entryComponents: [ErrorDialogComponent, RolepickComponent]
})
export class AppModule {
    constructor() {
    }
}
