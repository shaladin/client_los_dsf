
import { APP_INITIALIZER, NgModule } from '@angular/core';
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
import { ClaimTaskService } from './shared/claimTask.service';
import { StorageService } from './shared/services/StorageService';
import { EnviConfigService } from './shared/services/enviConfig.service';
import { UrlConstantService } from './shared/services/urlConstant.service';
import { UrlConstantNew } from './shared/constant/URLConstantNew';
import { ClipboardModule } from 'ngx-clipboard';
import { NGXToastrService } from './components/extra/toastr/toastr.service';
import { ApprovalTaskService } from './shared/services/ApprovalTask.service';
import { AdInsHelperService } from './shared/services/AdInsHelper.service';
import { AddressService } from './shared/services/custAddr.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UcdropdownsearchModule } from '@adins/ucdropdownsearch';
import { RolePickNewService } from './shared/rolepick/rolepick-new.service';

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

const enviConfig = (config: EnviConfigService) => {
    return () => {
        return config.loadConfig();
    }
}

const urlConstantConfig = (urlConfig: UrlConstantService) => {
    return () => {
        return urlConfig.loadConfig();
    }
}

@NgModule({
    declarations: [
        AppComponent,
        FullLayoutComponent,
        ContentLayoutComponent,
        ErrorDialogComponent,
        RolepickComponent,
        BackdoorComponent,
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
        CookieModule.forRoot(),
        // CookieModule.forRoot({ path: "", secure: true, httpOnly: false, sameSite: "strict" }),
        StorageServiceModule,
        MatDialogModule,
        BrowserAnimationsModule,
        GrowlModule,
        ClipboardModule,
        FormsModule,
        ReactiveFormsModule,
        UcdropdownsearchModule,
        TreeViewModule
    ],
    providers: [
        AuthService,
        AuthGuard,
        ErrorDialogService,
        RolePickService,
        RolePickNewService,
        ClaimTaskService,
        // UrlConstantNew,
        NGXToastrService,
        StorageService,
        EnviConfigService,
        ApprovalTaskService,
        AdInsHelperService,
        AddressService,
        // EnviConfigService,
        // {
        //     provide: APP_INITIALIZER, useFactory: enviConfig, multi: true, deps: [EnviConfigService]
        // },
        // UrlConstantService,
        // {
        //     provide: APP_INITIALIZER, useFactory: urlConstantConfig, multi: true, deps: [UrlConstantService]
        // },
        { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true }
    ],
    bootstrap: [AppComponent],
    entryComponents: [ErrorDialogComponent, RolepickComponent]
})
export class AppModule {
    constructor() {
    }
}
