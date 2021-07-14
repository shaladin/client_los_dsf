import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError, finalize } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { formatDate } from '@angular/common';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { ErrorDialogService } from 'app/error-dialog/error-dialog.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { CookieService } from 'ngx-cookie';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
    count = 0;
    constructor(public errorDialogService: ErrorDialogService, private spinner: NgxSpinnerService, private router: Router, public toastr: ToastrService, private cookieService: CookieService) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log(request);
        if (request.method == "POST" && (request.body == null || request.body.isLoading == undefined || request.body.isLoading == true)) {
            // this.spinner.show();
        }
        if (request.url != "./assets/i18n/en.json") {
            this.count++;
        }

        var currentUserContext = AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS) ? JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS)) : null;
        var token: string = "";
        var myObj;
        let today = new Date();
        var businessDt = formatDate(today, 'yyyy-MM-dd', 'en-US');

        var checkSession = AdInsHelper.CheckSessionTimeout(this.cookieService);
        if (checkSession == "1") {
            // this.errorDialogService.openDialog(AdInsErrorMessage.SessionTimeout);
            this.spinner.hide();
            this.router.navigate([NavigationConstant.PAGES_LOGIN]);
        }

        if (request.url.includes("Add") || request.url.includes("Edit") || request.url.includes("Delete")) {
            var n = request.url.lastIndexOf("/");
            var oldPath = request.url.substring(n + 1);
        } else {
            var oldPath = "-";
        }

        //Ini kalau buat Login belom punya Current User Contexts

        if (currentUserContext != null) {
            token = AdInsHelper.GetCookie(this.cookieService, CommonConstant.TOKEN);
            myObj = new Object();
            if (request.body != null) {
                myObj = request.body;
            }
            myObj["RequestDateTime"] = businessDt;
        }
        else {
            myObj = new Object();
            if (request.body != null) {
                myObj = request.body;
            }
            myObj["RequestDateTime"] = businessDt;
            token = AdInsHelper.GetCookie(this.cookieService, CommonConstant.TOKEN);
        }

        if (token == null) {
            token = "";
        }

        if (token != "") {
            request = request.clone({ headers: request.headers.set('AdInsKey', token) });
        }

        if (!request.headers.has('Content-Type')) {
            request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
        }
        request = request.clone({ headers: request.headers.set('Accept', 'application/json') });
        request = request.clone({ headers: request.headers.set('Authentication', 'my-authentication') });
        request = request.clone({ headers: request.headers.set('Access-Control-Allow-Origin', '*') });
        request = request.clone({ headers: request.headers.set('Access-Control-Allow-Credentials', 'true') });
        request = request.clone({ headers: request.headers.set('Access-Control-Allow-Methods', 'POST') });
        request = request.clone({ headers: request.headers.set('Access-Control-Allow-Headers', 'Content-Type,Accept,Authorization') });
        request = request.clone({ headers: request.headers.set('X-Content-Type-Options', 'nosniff') });
        request = request.clone({ headers: request.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0') });
        request = request.clone({ headers: request.headers.set('Pragma', 'no-cache') });
        request = request.clone({ headers: request.headers.set('Expires', '0') });
        request = request.clone({ body: myObj });
        AdInsHelper.InsertLog(this.cookieService, request.url, "API", request.body);
        console.log(JSON.stringify(request.body));
        // if (request.url.includes("Add") || request.url.includes("Edit") || request.url.includes("Delete")) {
        //     var q = "AddQueue";
        //     var url = request.url;
        //     var n = url.lastIndexOf("/");
        //     var envi = url.substring(0,n+1);
        //     var newUrl = envi.concat(q);

        //     var req = request.clone({url: newUrl});
        // } else {
        //     var req = request;
        // }
        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    //Ini Error kalau sudah masuk sampai ke Back End
                    if (event.body.HeaderObj != undefined) {
                        if (event.body.HeaderObj.StatusCode != undefined && event.body.HeaderObj.StatusCode != '200' && event.body.HeaderObj.StatusCode != "001" && event.body.HeaderObj.StatusCode != "002") {

                            if (event.body.HeaderObj.StatusCode == '400') {
                                for (var i = 0; i < event.body.HeaderObj.ErrorMessages.length; i++) {
                                    this.toastr.error(event.body.HeaderObj.ErrorMessages[i].Message, 'Status: ' + event.body.HeaderObj.StatusCode, { "tapToDismiss": true });
                                }
                            } else {
                                let data = {};
                                data = {
                                    reason: event.body.HeaderObj.Message ? event.body.HeaderObj.Message : '',
                                    status: event.body.HeaderObj.StatusCode
                                };
                                this.toastr.warning(data['reason'], 'Status: ' + data['status'], { "tapToDismiss": true });
                                console.log(event.body);
                            }

                            return;
                        }
                    }
                }

                return event;
            }),
            //Ini Error kalau tidak sampai ke Back End
            catchError((error: HttpErrorResponse) => {
                if (error.error != null) {
                    if (error.error.ErrorMessages != null) {
                        for (var i = 0; i < error.error.ErrorMessages.length; i++) {
                            this.toastr.error(error.error.ErrorMessages[i].Message, 'Status: ' + error.status, { "tapToDismiss": true });
                        }
                    } else {
                        this.toastr.error(error.error.Message, 'Status: ' + error.status, { "tapToDismiss": true });
                    }
                }
                else {
                    this.toastr.error(error.message, 'Status: ' + error.status, { "tapToDismiss": true });
                }

                console.log(JSON.stringify(request.body));
                return throwError(error);
            }), finalize(() => {
                if (request.url != "./assets/i18n/en.json") {
                    this.count--;
                }

                if (request.method == "POST") {
                    AdInsHelper.ClearPageAccessLog(this.cookieService);
                }
                if (this.count == 0) {
                    // this.spinner.hide();
                }
            })
        );
    }
}
