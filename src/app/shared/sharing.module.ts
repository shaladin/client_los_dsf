import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpModule } from '@angular/http';
import { AngularFileUploaderModule } from "angular-file-uploader";
import { MatStepperModule, MatIconModule, MatExpansionModule, MatTabsModule } from '@angular/material';
// import { SearchV2Component } from './search-v2/search-v2.component';
import { RouterModule } from '@angular/router';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
  }

@NgModule({
    exports: [
        CommonModule,
        NgbModule,
        TranslateModule,
        AngularFileUploaderModule,
        MatStepperModule,
        MatIconModule,
        MatExpansionModule,
        MatTabsModule
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        HttpModule,
        RouterModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            }
        }),
    ],
    declarations: [
        
    ]
})

export class SharingModule { }
