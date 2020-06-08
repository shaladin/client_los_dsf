import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ViewAssetDataComponent } from "../view-app-component/view-asset-data/view-asset-data.component";
const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'ViewAsset',
                component: ViewAssetDataComponent,
                data: {
                  title: 'Login Page'
                }
              }
        ]
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ViewSharingComponentRoutingModule { }
