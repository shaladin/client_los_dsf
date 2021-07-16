import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PathConstant } from "app/shared/constant/PathConstant";
import { UnauthorizedPageComponent } from "./unauthorized.component";

const routes: Routes = [
    {
      path: '',
      component: UnauthorizedPageComponent,
    }
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
  })
  export class MouRoutingModule { }