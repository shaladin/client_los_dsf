import { Routes, RouterModule } from '@angular/router';
import { BackdoorComponent } from 'app/backdoor/backdoor.component';
import { PathConstant } from '../constant/PathConstant';

//Route for content layout with sidebar, navbar and footer.

export const Full_ROUTES: Routes = [
  {
    path: PathConstant.LR_DASHBOARD,
    loadChildren: './dashboard/dashboard.module#DashboardModule'
  },
  {
    path: PathConstant.LR_FORMS,
    loadChildren: './forms/forms.module#FormModule'
  },
  {
    path: PathConstant.LR_COMPNT,
    loadChildren: './components/ui-components.module#UIComponentsModule'
  },
  {
    path: PathConstant.LR_NOTIF,
    loadChildren: './notification/notification.module#NotificationModule'
  },
  {
    path: PathConstant.LR_PAGES,
    loadChildren: './pages/full-pages/full-pages.module#FullPagesModule'
  },
  {
    path: PathConstant.LR_MOU,
    loadChildren: './MOU/mou.module#MouModule'
  },
  {
    path: PathConstant.LR_NAP,
    loadChildren: './NEW-NAP/nap.module#NapModule'
  },
  {
    path: PathConstant.LR_LEAD,
    loadChildren: './lead/lead.module#LeadModule'
  },
  {
    path: PathConstant.LR_INQUIRY,
    loadChildren: './inquiry/inquiry.module#InquiryModule'
  },
  // {
  //   path: 'View',
  //   loadChildren: './view/view.module#ViewModule'
  // },
  {
    path: PathConstant.LR_INTEGRATION,
    loadChildren: './integration/integration.module#IntegrationModule'
  },
  {
    path: PathConstant.LR_BACKDOOR,
    component: BackdoorComponent,
    data: {
      title: 'Backdoor Component'
    }
  },
  {
    path: 'requisitiondecision',
    loadChildren: './requisition-decision/requisition-decision.module#RequisitionDecisionModule'
  }
];
