import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProdOfferingViewRoutingModule } from './prod-offering-view-routing.module';
import { ProdOfferingViewComponent } from './prod-offering-view.component';
import { UcSubsectionModule } from '@adins/uc-subsection';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AdInsModule } from 'app/components/adins-module/adins.module';
import { MatTabsModule } from '@angular/material';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { createTranslateLoader } from 'app/app.module';
import { HttpClient } from '@angular/common/http';

@NgModule({
  declarations: [ProdOfferingViewComponent],
  imports: [
    CommonModule,
    AdInsModule,
    ProdOfferingViewRoutingModule,
    UcSubsectionModule,
    NgbModule,
    MatTabsModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: (createTranslateLoader),
          deps: [HttpClient]
      }
  })
  ]
})
export class ProdOfferingViewModule { }
