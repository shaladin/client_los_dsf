import { Routes } from '@angular/router';

export const TEST_ROUTES: Routes = [
     {
        path: 'asset',
        loadChildren: './test-paging-v3/asset/asset.module#AssetModule'
    }
];