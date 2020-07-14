import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { ErrorDialogService } from 'app/error-dialog/error-dialog.service';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from '../constant/CommonConstant';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  private previousUrl;
  private currentUrl;

  constructor(private router: Router,public errorDialogService: ErrorDialogService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    var currentUser = localStorage.getItem(CommonConstant.USER_ACCESS);
    // console.log("Router Interceptor" + route.url);

    this.previousUrl = route.url;
    this.currentUrl = state.url;

    AdInsHelper.InsertLog(this.currentUrl,"PAGE");

    // pengecekan menu dihilangkan dulu, karna belum get menu dari backend

    // if(!AdInsHelper.IsGrantAccess(this.currentUrl))
    // {
    //   // this.errorDialogService.openDialog(AdInsErrorMessage.PageNotAuthorized);
    //   // this.router.navigate([AdInsConstant.FormDefault]);
    // }

    if (currentUser == null) {
      this.router.navigate(['pages/login'])
      return false;
    }
    else {
      return true;
    }
  }


}
