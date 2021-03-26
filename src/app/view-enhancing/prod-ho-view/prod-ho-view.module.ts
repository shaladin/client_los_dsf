import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProdHoViewRoutingModule } from './prod-ho-view-routing.module';
import { ProdHoViewComponent } from './prod-ho-view.component';
import { UcSubsectionModule } from '@adins/uc-subsection';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatTabsModule } from '@angular/material';
import { AdInsModule } from 'app/components/adins-module/adins.module';

@NgModule({
  declarations: [ProdHoViewComponent],
  imports: [
    CommonModule,
    AdInsModule,
    ProdHoViewRoutingModule,
    UcSubsectionModule,
    NgbModule,
    MatTabsModule,
  ]
})
export class ProdHoViewModule { }
