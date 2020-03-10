import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UIComponentsRoutingModule } from "./ui-components-routing.module";
import { NouisliderModule } from 'ng2-nouislider';
import { FileUploadModule } from 'ng2-file-upload/ng2-file-upload';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { JsonpModule } from '@angular/http';
import { QuillModule } from 'ngx-quill'
import { DragulaModule } from 'ng2-dragula';
import { MatchHeightModule } from "../shared/directives/match-height.directive";
import { ImageCropperModule } from 'ng2-img-cropper';
import { TagInputModule } from 'ngx-chips';
import { HttpModule } from '@angular/http';
import { UiSwitchModule } from 'ngx-ui-switch';
import { NgSelectModule } from '@ng-select/ng-select';

import { ToastrComponent } from "./extra/toastr/toastr.component";
import { TypeaheadComponent } from './bootstrap/typeahead/typeahead.component';

@NgModule({
    imports: [
        CommonModule,
        UIComponentsRoutingModule,
        NouisliderModule,
        FileUploadModule,
        FormsModule,
        ReactiveFormsModule,
        JsonpModule,
        NgbModule,
        QuillModule,
        DragulaModule,
        MatchHeightModule,
        ImageCropperModule,
        TagInputModule,
        HttpModule,
        UiSwitchModule,
        NgSelectModule
    ],
    declarations: [
        ToastrComponent,
        TypeaheadComponent
    ],
    entryComponents: []
})
export class UIComponentsModule { }
