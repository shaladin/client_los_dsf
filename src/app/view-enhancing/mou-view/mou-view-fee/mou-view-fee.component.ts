import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-mou-view-fee',
  templateUrl: './mou-view-fee.component.html',
  providers: [NGXToastrService]
})
export class MouViewFeeComponent implements OnInit {
  @Input() MouCustId: number;

  listFeeData: any;

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService) { }

  ngOnInit() {
    var mouCustObj = { Id: this.MouCustId }
    this.http.post(URLConstant.GetMouCustFeeByMouCustId, mouCustObj).subscribe(
      (response) => {
        this.listFeeData = response;
      })
  }

  FeeDataForm = this.fb.group({
  })

}
