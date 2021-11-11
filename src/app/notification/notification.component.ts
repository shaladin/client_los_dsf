import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NotificationObj } from 'app/shared/model/notification-obj.model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  providers: [NGXToastrService]
})
export class NotificationComponent implements OnInit {

  type: string = 'success';
  notificationObj: NotificationObj;
  payload: any;

  constructor(private router: Router, private http: HttpClient, private toastr: NGXToastrService) {

  }

  ngOnInit() {
  }

  SaveForm(NotifReqForm: NgForm): void {
    this.notificationObj = new NotificationObj();
    this.notificationObj.type = NotifReqForm.value.type;
    this.notificationObj.payload = NotifReqForm.value.payload;

    this.http.post(URLConstant.NotificationPost, this.notificationObj).subscribe(
      (response) => {
        this.toastr.successMessage(response['message']);
        this.router.navigateByUrl('/office', { skipLocationChange: true }).then(() =>
          this.router.navigateByUrl("/notification"));
      },
      (error) => {
      }
    );
  }
}
