import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';

@Component({
  selector: 'app-customer-self-verification',
  templateUrl: './customer-self-verification.component.html',
  styleUrls: ['./customer-self-verification.component.scss'],
  providers: [NGXToastrService]
})
export class CustomerSelfVerificationComponent implements OnInit {
  LeadId : any;
  LobCode: string;
  
  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService) {
    this.route.queryParams.subscribe(params => {
      this.LeadId = params["LeadId"];
      if (this.LeadId == null || this.LeadId == undefined) this.LeadId = "1";

      this.LobCode = params["LobCode"];
      if (this.LobCode == null || this.LobCode == undefined) this.LobCode = "KTA";
    })
  }

  ngOnInit() {
  }

  EnterTab(type) {
    if (type == "Cust") {
    }
    if (type == "Lead") {
    }
  }
}
