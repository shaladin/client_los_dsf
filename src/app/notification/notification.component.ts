import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { NgForm } from '@angular/forms';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { NotificationObj } from 'app/shared/model/NotificationObj.Model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
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
  apiUrl: any;
  foundationUrl: string = environment.FoundationR3Url;
  payload: any;

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService) { 
    this.apiUrl = this.foundationUrl + URLConstant.NotificationPost;
    
  }

  ngOnInit() {
  }

  SaveForm(NotifReqForm: NgForm): void {
    this.notificationObj = new NotificationObj();
    this.notificationObj.type = NotifReqForm.value.type;
    this.notificationObj.payload = NotifReqForm.value.payload;

    this.http.post(this.apiUrl, this.notificationObj).subscribe(
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
