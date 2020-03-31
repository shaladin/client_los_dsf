import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsConstant } from 'app/shared/AdInstConstant';

@Component({
  selector: 'app-mou-view-fee',
  templateUrl: './mou-view-fee.component.html',
  styleUrls: ['./mou-view-fee.component.scss'],
  providers: [NGXToastrService]
})
export class MouViewFeeComponent implements OnInit {
  @Input() MouCustId: any;

  listFeeData: any;

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService) { }

  ngOnInit() {
    var mouCustObj = { MouCustId: this.MouCustId }
    console.log(mouCustObj);
    this.http.post(AdInsConstant.GetMouCustFeeByMouCustId, mouCustObj).subscribe(
      (response) => {
        this.listFeeData = response['ReturnObject'];
      })
  }

  FeeDataForm = this.fb.group({
  })

}
