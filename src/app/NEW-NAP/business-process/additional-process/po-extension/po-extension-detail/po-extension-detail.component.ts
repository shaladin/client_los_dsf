import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';

@Component({
  selector: 'app-po-extension-detail',
  templateUrl: './po-extension-detail.component.html',
  styleUrls: ['./po-extension-detail.component.scss']
})
export class PoExtensionDetailComponent implements OnInit {
  AppId: number;
  PurchaseOrderHId: number;
  viewObj: string;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private route: ActivatedRoute, private toastr: NGXToastrService) {
    this.route.queryParams.subscribe(params => {
      this.AppId = params["AppId"];
      this.PurchaseOrderHId = params["PurchaseOrderHId"];
    });
  }

  POExtForm = this.fb.group({
    PurchaseOrderExpiredDt: ['']
  });

  ngOnInit() {
    this.viewObj = "./assets/ucviewgeneric/viewPOExtensionInfo.json";
  }

  SaveForm(){
    var obj={
      AppId: this.AppId,
      PurchaseOrderHId: this.PurchaseOrderHId,
      PurchaseOrderExpiredDt: this.POExtForm.controls.PurchaseOrderExpiredDt.value
    }
    this.http.post(AdInsConstant.SubmitNewExpDate, obj).subscribe(
      response => {
        this.toastr.successMessage(response["message"]);
        this.router.navigate(["/Nap/AddProcess/POExtension/Paging"]);
      },
      error => {
        console.log(error);
      }
    );
  }
}
