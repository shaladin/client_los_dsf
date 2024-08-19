import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { ErrorDialogService } from 'app/error-dialog/error-dialog.service';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from '../constant/CommonConstant';
import { NavigationConstant } from '../constant/NavigationConstant';
import { CookieService } from 'ngx-cookie';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  private previousUrl;
  private currentUrl;

  constructor(private router: Router,public errorDialogService: ErrorDialogService, private cookieService: CookieService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    var currentUser = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

    this.previousUrl = route.url;
    this.currentUrl = state.url;

    AdInsHelper.InsertLog(this.cookieService, this.currentUrl,"PAGE");

    // pengecekan menu dihilangkan dulu, karna belum get menu dari backend

    // if(!AdInsHelper.IsGrantAccess(this.currentUrl))
    // {
    //   // this.errorDialogService.openDialog(AdInsErrorMessage.PageNotAuthorized);
    //   // this.router.navigate([AdInsConstant.FormDefault]);
    // }

    if (currentUser == null) {
      AdInsHelper.RedirectUrl(this.router, [NavigationConstant.PAGES_LOGIN], {});
      return false;
    }
    else {
      return true;
    }
  }


}
