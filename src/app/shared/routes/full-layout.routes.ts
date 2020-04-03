import { Routes, RouterModule } from '@angular/router';

//Route for content layout with sidebar, navbar and footer.

export const Full_ROUTES: Routes = [
  {
    path: 'dashboard',
    loadChildren: './dashboard/dashboard.module#DashboardModule'
  },
   {
    path: 'forms',
    loadChildren: './forms/forms.module#FormModule'
  },
  {
    path: 'components',
    loadChildren: './components/ui-components.module#UIComponentsModule'
  },
  {
    path: 'notification',
    loadChildren: './notification/notification.module#NotificationModule'
  },
  {
    path: 'pages',
    loadChildren: './pages/full-pages/full-pages.module#FullPagesModule'
  },
  {
    path: 'Mou',
    loadChildren: './MOU/mou.module#MouModule'
  },
  {
    path: 'Nap',
    loadChildren: './NAP/nap.module#NapModule'
  },
  {
    path: 'Inquiry',
    loadChildren: './inquiry/inquiry.module#InquiryModule'
  },
  {
    path: 'AdminProcess',
    loadChildren: './admin-process/admin-process.module#AdminProcessModule'
  },
  {
    path: 'View',
    loadChildren: './view/view.module#ViewModule'
  },
  {
    path: 'Lead',
    loadChildren: './lead/lead.module#LeadModule'
  }
];
