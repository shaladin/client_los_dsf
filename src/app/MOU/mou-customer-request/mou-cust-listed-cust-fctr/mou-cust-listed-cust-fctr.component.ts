import { Component, OnInit, Input } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { MouCustListedCustFctrObj } from 'app/shared/model/MouCustListedCustFctrObj.Model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { MouCustListedCustFctrDetailComponent } from './mou-cust-listed-cust-fctr-detail/mou-cust-listed-cust-fctr-detail.component';
import { environment } from 'environments/environment';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-mou-cust-listed-cust-fctr',
  templateUrl: './mou-cust-listed-cust-fctr.component.html'
})
export class MouCustListedCustFctrComponent implements OnInit {
  @Input() MouCustId: number;
  @Input() IsListedCustFctr: boolean;
  listedCusts: any;

  MouCustIsListedForm = this.fb.group({
    IsListedCust: ['']
  });

  constructor(
    private httpClient: HttpClient,
    private modalService: NgbModal,
    private toastr: NGXToastrService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.MouCustIsListedForm.patchValue({
      IsListedCust: this.IsListedCustFctr
    });
    var mouListedFctr = new MouCustListedCustFctrObj();
    mouListedFctr.MouCustId = this.MouCustId;
    this.httpClient.post(URLConstant.GetListMouCustListedCustFctrByMouCustId, mouListedFctr).subscribe(
      (response) => {
        this.listedCusts = response["mouCustListedCustFctrObjs"];
      },
      (error) => {
        console.log(error);
      }
    );
  }

  openModalAddCustFctr() {
    const modalListedFctr = this.modalService.open(MouCustListedCustFctrDetailComponent);
    modalListedFctr.componentInstance.MouCustId = this.MouCustId;
    modalListedFctr.result.then(
      (response) => {
        this.spinner.show();
        var mouListedFctr = new MouCustListedCustFctrObj();
        mouListedFctr.MouCustId = this.MouCustId;
        this.httpClient.post(URLConstant.GetListMouCustListedCustFctrByMouCustId, mouListedFctr).subscribe(
          (response) => {
            this.listedCusts = response["mouCustListedCustFctrObjs"];
          },
          (error) => {
            console.log(error);
          }
        );
        this.spinner.hide();
        this.toastr.successMessage(response["message"]);
      }
    ).catch((error) => {
      if (error != 0) {
        console.log(error);
      }
    });
  }

  openView(custNo) {
    var link: string;
    var custObj = { CustNo: custNo };
    this.httpClient.post(URLConstant.GetCustByCustNo, custObj).subscribe(
      response => {
        AdInsHelper.OpenCustomerViewByCustId(response["CustId"]);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  deleteCustFctr(custFctrId, idx) {
    if (this.MouCustIsListedForm.controls["IsListedCust"].value == true) {
      if (confirm('Are you sure to delete this record?')) {
        var mouListedFctr = new MouCustListedCustFctrObj();
        mouListedFctr.MouListedCustFctrId = custFctrId;
        this.httpClient.post(URLConstant.DeleteMouCustListedCustFctr, mouListedFctr).subscribe(
          (response: any) => {
            this.listedCusts.splice(idx, 1);
            this.toastr.successMessage(response["Message"]);
          },
          (error) => {
            console.log(error);
          }
        );
      }
    }
  }
}
