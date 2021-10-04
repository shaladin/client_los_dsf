import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustAgrmntListViewRoutingModule } from './cust-agrmnt-list-view-routing.module';
import { CustAgrmntListViewComponent } from './cust-agrmnt-list-view.component';
import { UcSubsectionModule } from '@adins/uc-subsection';
import { AdInsSharedModule } from 'app/components/adins-module/AdInsShared.Module';

@NgModule({
  declarations: [CustAgrmntListViewComponent],
  imports: [
    CommonModule,
    AdInsSharedModule,
    CustAgrmntListViewRoutingModule,
    UcSubsectionModule
  ]
})
export class CustAgrmntListViewModule { }
