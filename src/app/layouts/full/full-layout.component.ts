import { Component, OnInit, ElementRef } from '@angular/core';
import { StorageService } from 'app/shared/services/StorageService';
import { NgxSpinnerService } from 'ngx-spinner';

var fireRefreshEventOnWindow = function () {
    var evt = document.createEvent("HTMLEvents");
    evt.initEvent('resize', true, false);
    window.dispatchEvent(evt);
};

@Component({
    selector: 'app-full-layout',
    templateUrl: './full-layout.component.html',
    styleUrls: ['./full-layout.component.css']
})

export class FullLayoutComponent implements OnInit {

    options = {
        direction: 'ltr'
    };
    subEnd: any;

    constructor(private elementRef: ElementRef, private strService: StorageService, private spinner: NgxSpinnerService) { }

    ngOnInit() {
        // this.subEnd = this.strService.watch("isLoading").subscribe(
        //     (response) => {
        //         if (response == true) {
        //             this.spinner.show();
        //         } else {
        //             this.spinner.hide();
        //         }

        //     }
        // );

        //sidebar toggle event listner
        this.elementRef.nativeElement.querySelector("#sidebarToggle")
            .addEventListener("click", this.onClick.bind(this));
        //customizer events
        this.elementRef.nativeElement.querySelector("#cz-compact-menu")
            .addEventListener("click", this.onClick.bind(this));
        this.elementRef.nativeElement.querySelector("#cz-sidebar-width")
            .addEventListener("click", this.onClick.bind(this));
    }

    ngOnDestroy() {
        // this.subEnd.unsubscribe();
        // this.unsubscribe.next();
        // this.unsubscribe.complete();
    }

    onClick(event) {
        //initialize window resizer event on sidebar toggle click event
        setTimeout(() => { fireRefreshEventOnWindow() }, 300);
    }

    getOptions($event): void {
        this.options = $event;
    }

}
