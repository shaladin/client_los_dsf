import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DummyComponent } from './dummy/dummy.component'; 
import { AppInquiryComponent } from './additional-process/app-inquiry/app-inquiry.component';
import { CreditProcessInquiryComponent } from './additional-process/credit-process-inquiry/credit-process-inquiry.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'dummy',
        component: DummyComponent,
        data: {
          title: 'dummy'
        }
      },
      {
        path: 'AppInquiry',
        component: AppInquiryComponent,
        data: {
          title: 'App Inquiry'
        }
      } ,
      {
        path: 'CreditProcess',
        component: CreditProcessInquiryComponent,
        data: {
          title: 'Credit Process Inquiry'
        }
      } 
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InputNapFL4WRoutingModule { }
