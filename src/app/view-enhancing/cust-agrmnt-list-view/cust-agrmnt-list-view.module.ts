import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustAgrmntListViewRoutingModule } from './cust-agrmnt-list-view-routing.module';
import { CustAgrmntListViewComponent } from './cust-agrmnt-list-view.component';
import { UcSubsectionModule } from '@adins/uc-subsection';

@NgModule({
  declarations: [CustAgrmntListViewComponent],
  imports: [
    CommonModule,
    CustAgrmntListViewRoutingModule,
    UcSubsectionModule
  ]
})
export class CustAgrmntListViewModule { }
