import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FraudDetectionVerifComponent } from './fraud-detection-verif/fraud-detection-verif.component';
import { FraudDetectionPagingComponent } from './fraud-detection-paging/fraud-detection-paging.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'FraudDetection',
        component: FraudDetectionVerifComponent,
        data: {
          title: 'Fraud Detection'
        }
      },
      {
        path: 'FraudDetectionPaging',
        component: FraudDetectionPagingComponent,
        data: {
          title: 'Fraud Detection Paging'
        }
      }
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FraudDetectionRoutingComponent { }
