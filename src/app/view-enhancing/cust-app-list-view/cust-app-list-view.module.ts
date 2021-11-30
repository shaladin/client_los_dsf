import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustAppListViewRoutingModule } from './cust-app-list-view-routing.module';
import { CustAppListViewComponent } from './cust-app-list-view.component';
import { UcSubsectionModule } from '@adins/uc-subsection';
import { AdInsSharedModule } from 'app/components/adins-module/adIns-shared.module';

@NgModule({
  declarations: [CustAppListViewComponent],
  imports: [
    CommonModule,
    AdInsSharedModule,
    CustAppListViewRoutingModule,
    UcSubsectionModule
  ]
})
export class CustAppListViewModule { }
