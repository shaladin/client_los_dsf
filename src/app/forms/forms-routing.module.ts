import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ValidationFormsComponent } from "./validation/validation-forms.component";
import { WizardFormsComponent } from "./wizard/wizard-forms.component";
import { BasicComponent } from './layouts/basic/basic.component';
import { HorizontalComponent } from './layouts/horizontal/horizontal.component';
import { HiddenLabelsComponent } from './layouts/hidden-labels/hidden-labels.component';
import { FormActionsComponent } from './layouts/form-actions/form-actions.component';
import { BorderedComponent } from './layouts/bordered/bordered.component';
import { StripedRowsComponent } from './layouts/striped-rows/striped-rows.component';
import { InputsComponent } from './elements/inputs/inputs.component';
import { InputGroupsComponent } from './elements/input-groups/input-groups.component';
import { InputGridComponent } from './elements/input-grid/input-grid.component';
import { ArchwizardComponent } from './archwizard/archwizard.component';
import { ReportComponent } from './report/report.component';
import { PathConstant } from 'app/shared/constant/PathConstant';

const routes: Routes = [
  {
    path: '',    
    children: [
      {
        path: PathConstant.BASIC,
        component: BasicComponent,
        data: {
          title: 'Basic Forms'
        }
      },
      {
        path: PathConstant.HORIZONTAL,
        component: HorizontalComponent,
        data: {
          title: 'Horizontal Forms'
        }
      },
      {
        path: PathConstant.HIDDEN_LABELS,
        component: HiddenLabelsComponent,
        data: {
          title: 'Hidden Labels'
        }
      },
      {
        path: PathConstant.FORM_ACTIONS,
        component: FormActionsComponent,
        data: {
          title: 'Form Actions'
        }
      },
      {
        path: PathConstant.BORDERED,
        component: BorderedComponent,
        data: {
          title: 'Bordered Forms'
        }
      },
      {
        path: PathConstant.STRIPED_ROWS,
        component: StripedRowsComponent,
        data: {
          title: 'Striped Rows'
        }
      },
      {
        path: PathConstant.INPUTS,
        component: InputsComponent,
        data: {
          title: 'Inputs'
        }
      },
      {
        path: PathConstant.INPUT_GROUPS,
        component: InputGroupsComponent,
        data: {
          title: 'Input Groups'
        }
      },
      {
        path: PathConstant.INPUT_GRID,
        component: InputGridComponent,
        data: {
          title: 'Input Grid'
        }
      },
      {
        path: PathConstant.VALIDATION,
        component: ValidationFormsComponent,
        data: {
          title: 'Validation Forms'
        }
      }, 
      {
        path: PathConstant.WIZARD,
        component: WizardFormsComponent,
        data: {
          title: 'Wizard Forms'
        }
      },
      {
        path: PathConstant.NGX,
        loadChildren: './ngx-wizard/ngx-wizard.module#NGXFormWizardModule'
      },
      {
        path: PathConstant.ARCHWIZARD,
        component: ArchwizardComponent,
        data: {
          title: 'Angular Wizard Forms'
        }
      },
      {
        path: PathConstant.REPORT,
        component: ReportComponent,
        data: {
          title: 'Report'
        }
      }
            
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormsRoutingModule { }
