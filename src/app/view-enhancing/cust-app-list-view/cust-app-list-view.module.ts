import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustAppListViewRoutingModule } from './cust-app-list-view-routing.module';
import { CustAppListViewComponent } from './cust-app-list-view.component';
import { UcSubsectionModule } from '@adins/uc-subsection';

@NgModule({
  declarations: [CustAppListViewComponent],
  imports: [
    CommonModule,
    CustAppListViewRoutingModule,
    UcSubsectionModule
  ]
})
export class CustAppListViewModule { }
