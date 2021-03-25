import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProdOfferingViewRoutingModule } from './prod-offering-view-routing.module';
import { ProdOfferingViewComponent } from './prod-offering-view.component';

@NgModule({
  declarations: [ProdOfferingViewComponent],
  imports: [
    CommonModule,
    ProdOfferingViewRoutingModule
  ]
})
export class ProdOfferingViewModule { }
