import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';

import { FullPagesRoutingModule } from "app/pages/full-pages/full-pages-routing.module";
import { ChartistModule} from 'ng-chartist';
import { AgmCoreModule } from '@agm/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { UserProfilePageComponent } from "app/pages/full-pages/user-profile/user-profile-page.component";
import { AdInsSharedModule } from 'app/components/adins-module/AdInsShared.Module';


@NgModule({
    imports: [
        CommonModule,
        FullPagesRoutingModule,
        FormsModule,
        AdInsSharedModule,
        ChartistModule,
        AgmCoreModule,
        NgbModule,
    ],
    declarations: [       
        UserProfilePageComponent
    ]
})
export class FullPagesModule { }
