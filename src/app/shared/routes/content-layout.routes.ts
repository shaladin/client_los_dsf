import { Routes, RouterModule } from '@angular/router';
import { PathConstant } from '../constant/PathConstant';

//Route for content layout without sidebar, navbar and footer for pages like Login, Registration etc...

export const CONTENT_ROUTES: Routes = [
     {
        path: PathConstant.PAGES,
        loadChildren: './pages/content-pages/content-pages.module#ContentPagesModule'
    },
    {
        path: PathConstant.VIEW,
        loadChildren: 'app/view-enhancing/view.module#ViewModule'
    },
];