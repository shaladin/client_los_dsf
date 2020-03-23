import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-notification-sidebar',
  templateUrl: './notification-sidebar.component.html',
  styleUrls: ['./notification-sidebar.component.scss']
})
export class NotificationSidebarComponent implements OnInit {

  ngOnInit() {
    // notification-sidebar JS File
    $.getScript('./assets/js/notification-sidebar.js');
  }

}
