import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-mou-view-legal',
  templateUrl: './mou-view-legal.component.html',
  providers: [NGXToastrService]
})
export class MouViewLegalComponent implements OnInit {
  @Input() MouCustId: number;

  listLglReviewData: any;

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService) { }

  ngOnInit() {
    var mouCustObj = { MouCustId: this.MouCustId }
    this.http.post(URLConstant.GetMouCustLglReviewByMouCustId, mouCustObj).subscribe(
      (response) => {
        this.listLglReviewData = response['ReturnObject'];
      })
  }

  LegalReviewForm = this.fb.group({
  })
}
