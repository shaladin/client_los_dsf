import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpModule } from '@angular/http';
import { AngularFileUploaderModule } from "angular-file-uploader";
import { MatStepperModule, MatIconModule, MatExpansionModule, MatTabsModule } from '@angular/material';
// import { SearchV2Component } from './search-v2/search-v2.component';
import { RouterModule } from '@angular/router';
import { AdInsSharedModule } from 'app/components/adins-module/adIns-shared.module';

@NgModule({
    exports: [
        CommonModule,
        NgbModule,
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
        AdInsSharedModule
    ],
    declarations: [
        
    ]
})

export class SharingModule { }
