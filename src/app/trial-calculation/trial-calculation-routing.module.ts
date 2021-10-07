import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PathConstant } from 'app/shared/constant/PathConstant';
import { TrialCalculationComponent } from './trial-calculation.component';
import { TrialCalculationXComponent } from 'app/impl/trial-calculation/trial-calculation-x.component';
import { PathConstantX } from 'app/impl/shared/constant/PathConstantX';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: PathConstant.TRIAL_CALC,
        component: TrialCalculationComponent,
        data: {
          title: 'Trial Calculation'
        }
      },
      {
        path: PathConstantX.TRIAL_CALC_X,
        component: TrialCalculationXComponent,
        data: {
          title: 'Trial Calculation'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrialCalculationRoutingModule { }
