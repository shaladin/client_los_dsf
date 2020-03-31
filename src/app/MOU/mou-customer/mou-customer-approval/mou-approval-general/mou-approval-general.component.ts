import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { MouCustObj } from 'app/shared/model/MouCustObj.Model';

@Component({
  selector: 'app-mou-approval-general',
  templateUrl: './mou-approval-general.component.html',
  styleUrls: ['./mou-approval-general.component.scss'],
  providers: [NGXToastrService]
})
export class MouApprovalGeneralComponent implements OnInit {
  mouCustObj: MouCustObj;
  MouCustId : any;
  MouType : string = "GENERAL";

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService) {
    this.route.queryParams.subscribe(params => {
      this.MouCustId = params["MouCustId"];
    })
  }

  ngOnInit() {
  }

  MouApprovalDataForm = this.fb.group({
  })
}
