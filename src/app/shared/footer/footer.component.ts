import { Component, HostBinding } from '@angular/core';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.css']
})

export class FooterComponent{
    //Variables
    currentDate : Date = new Date();
}
