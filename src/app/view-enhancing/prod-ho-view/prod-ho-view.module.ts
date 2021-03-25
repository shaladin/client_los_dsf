import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProdHoViewRoutingModule } from './prod-ho-view-routing.module';
import { ProdHoViewComponent } from './prod-ho-view.component';

@NgModule({
  declarations: [ProdHoViewComponent],
  imports: [
    CommonModule,
    ProdHoViewRoutingModule
  ]
})
export class ProdHoViewModule { }
