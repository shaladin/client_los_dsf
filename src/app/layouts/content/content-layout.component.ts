import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { StorageService } from 'app/shared/services/StorageService';

@Component({
    selector: 'app-content-layout',
    templateUrl: './content-layout.component.html',
    styleUrls: ['./content-layout.component.scss']
})

export class ContentLayoutComponent {  
    
    unsubscribe: any;
    constructor(public translate: TranslateService, private strService: StorageService) {
        const browserLang: string = translate.getBrowserLang();
        let langUse: string = 'en';
        this.unsubscribe = this.strService.watch(AdInsConstant.WatchRoleLang).subscribe(
            (response) => {
                console.log(response);
                if (response) {
                    langUse = response;
                    this.translate.use(response);
                }
            }
        );
        translate.use(browserLang.match(/en|id|pt|de/) ? browserLang : langUse);
    }

    ngOnInit() {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        // this.unsubscribe = this.strService.watch(AdInsConstant.WatchRoleLang).subscribe(
        //     (response) => {
        //         console.log(response);
        //         if (response) {
        //             this.translate.use(response);
        //         }
        //     }
        // );
    }
    
    ChangeLanguage(language: string) {
        localStorage.setItem('lang',language);
        this.strService.set('lang', language);
        this.translate.use(language);
    }

    ngOnDestroy() {
        // this.subEnd.unsubscribe();
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}