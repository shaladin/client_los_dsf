import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";

import { DashboardRoutingModule } from "app/dashboard/dashboard-routing.module";
import { ChartistModule } from 'ng-chartist';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatchHeightModule } from "app/shared/directives/match-height.directive";

import { Dashboard1Component } from "app/dashboard/dashboard1/dashboard1.component";
import { Dashboard2Component } from "app/dashboard/dashboard2/dashboard2.component";
import { DashBoardComponent } from 'app/dashboard/dash-board/dash-board.component';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { ContextMenuModule } from '@progress/kendo-angular-menu';
import { SharingComponentModule } from 'app/shared/sharingcomponent.module';


@NgModule({
    imports: [
        CommonModule,
        DashboardRoutingModule,
        ChartistModule,
        NgbModule,
        MatchHeightModule,
        TreeViewModule,
        ContextMenuModule,
        SharingComponentModule
    ],
    exports: [],
    declarations: [
        Dashboard1Component,
        Dashboard2Component,
        DashBoardComponent
    ],
    providers: [],
})
export class DashboardModule { }
