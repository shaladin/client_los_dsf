import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { HttpClient } from '@angular/common/http';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { environment } from 'environments/environment';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-mou-cust-listed-cust-fctr-detail',
  templateUrl: './mou-cust-listed-cust-fctr-detail.component.html'
})
export class MouCustListedCustFctrDetailComponent implements OnInit {
  @Input() MouCustId: number;
  inputLookupObj: InputLookupObj;

  MouListedCustFctrForm = this.fb.group({
    MouListedCustFctrId: [0, [Validators.required]],
    MouCustId: [0, [Validators.required]],
    CustNo: ['', [Validators.required]],
    CustName: ['', [Validators.required]],
    MrCustTypeCode: ['', [Validators.required]],
    RowVersion: ['']
  });

  constructor(
    private httpClient: HttpClient,
    private toastr: NGXToastrService,
    private fb: FormBuilder,
    public activeModal: NgbActiveModal
  ) { 
    this.inputLookupObj = new InputLookupObj();
    this.inputLookupObj.urlJson = "./assets/uclookup/MOU/lookupCust_MOUListCustFctr.json";
    this.inputLookupObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.inputLookupObj.urlEnviPaging = environment.FoundationR3Url;
    this.inputLookupObj.pagingJson = "./assets/uclookup/MOU/lookupCust_MOUListCustFctr.json";
    this.inputLookupObj.genericJson = "./assets/uclookup/MOU/lookupCust_MOUListCustFctr.json";

    this.inputLookupObj.ddlEnvironments = [
      {
        name: "A.MR_CUST_TYPE_CODE",
        environment: environment.FoundationR3Url
      }
    ];
  }

  ngOnInit() {
    this.MouListedCustFctrForm.patchValue({
      MouCustId: this.MouCustId
    });
  }

  getLookupResponse(e){
    this.MouListedCustFctrForm.patchValue({
      CustNo: e.custNo,
      CustName: e.custName,
      MrCustTypeCode: e.mrCustTypeCode,
    });
  }

  Save(enjiForm){
    var formData = this.MouListedCustFctrForm.value;
    this.httpClient.post(URLConstant.AddMouCustListedCustFctr, formData).subscribe(
      (response) => {
        this.activeModal.close(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }

}
