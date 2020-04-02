import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { MouCustObj } from 'app/shared/model/MouCustObj.Model';

@Component({
  selector: 'app-mou-review-factoring',
  templateUrl: './mou-review-factoring.component.html',
  styleUrls: ['./mou-review-factoring.component.scss'],
  providers: [NGXToastrService]
})
export class MouReviewFactoringComponent implements OnInit {
  mouCustObj: MouCustObj;
  MouCustId : any;
  MouType : string = "FACTORING";
  
  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService) {
    this.route.queryParams.subscribe(params => {
      this.MouCustId = params["MouCustId"];
    })
  }

  ngOnInit() {
  }

  MouReviewDataForm = this.fb.group({
  })
}
