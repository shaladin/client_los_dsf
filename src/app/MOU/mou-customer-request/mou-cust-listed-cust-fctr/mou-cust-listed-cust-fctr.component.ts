import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormArray, Validators } from '@angular/forms';
import { MouCustListedCustFctrObj } from 'app/shared/model/mou-cust-listed-cust-fctr-obj.model';
import { MouCustListedCustFctrDetailComponent } from './mou-cust-listed-cust-fctr-detail/mou-cust-listed-cust-fctr-detail.component';
import { environment } from 'environments/environment';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { InputLookupObj } from 'app/shared/model/input-lookup-obj.model';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { AdInsHelperService } from 'app/shared/services/AdInsHelper.service';

@Component({
  selector: 'app-mou-cust-listed-cust-fctr',
  templateUrl: './mou-cust-listed-cust-fctr.component.html'
})

export class MouCustListedCustFctrComponent implements OnInit {
  @Input() MouCustId: number;
  @Input() IsListedCustFctr: boolean;
  @Output() OutputData: EventEmitter<any> = new EventEmitter();
  @Output() OutputIsListedCust: EventEmitter<any> = new EventEmitter();
  listedCusts: Array<MouCustListedCustFctrObj>;
  inputLookupObj: InputLookupObj;
  CustNoObj: GenericObj = new GenericObj();
  dictLookup: {[key: string]: InputLookupObj;} = {};
  InputLookupCustomerObjs: Array<InputLookupObj> = new Array<InputLookupObj>();

  MouCustIsListedForm = this.fb.group({
    IsListedCust: [''],
    ListCust: this.fb.array([]),
  });

  constructor(private httpClient: HttpClient,
    private modalService: NgbModal,
    private toastr: NGXToastrService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private http: HttpClient,
    private AdInsHelperService: AdInsHelperService) { }

  ngOnInit() {
    this.MouCustIsListedForm.patchValue({
      IsListedCust: this.IsListedCustFctr
    });
    var mouListedFctr = new MouCustListedCustFctrObj();
    mouListedFctr.MouCustId = this.MouCustId;
    this.httpClient.post<Array<MouCustListedCustFctrObj>>(URLConstant.GetListMouCustListedCustFctrByMouCustId, { Id: this.MouCustId }).subscribe(
      (response) => {
        this.listedCusts = response[CommonConstant.ReturnObj];
        var MouCustListedCustFctrObjs = this.MouCustIsListedForm.get("ListCust") as FormArray;
        for (let i = 0; i < this.listedCusts.length; i++) {
          MouCustListedCustFctrObjs.push(this.addGroup(this.listedCusts[i], i));

          var InputLookupCustomerObj = this.initLookup();
          this.InputLookupCustomerObjs.push(InputLookupCustomerObj);
          this.dictLookup[i] = InputLookupCustomerObj;
          this.setCustName(i, this.listedCusts[i].CustNo);
        }
        this.OutputData.emit(MouCustListedCustFctrObjs.getRawValue());
      }
    );   
  }

  async setCustName(i, custNo){
    this.CustNoObj.CustNo = custNo;
    await this.http.post(URLConstant.GetCustByCustNo, this.CustNoObj).toPromise().then(
      (response) => {
        console.log(response);
        
        this.dictLookup[i].nameSelect = response["CustNo"];
        this.dictLookup[i].jsonSelect = response;
        this.InputLookupCustomerObjs[i].jsonSelect = response;
        
        this.MouCustIsListedForm.controls['ListCust']['controls'][i].patchValue({
          CustNo: response["CustNo"],
          CustName: response["CustName"],
          MrCustTypeCode: response["MrCustTypeCode"]
        });
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
        this.httpClient.post(URLConstant.GetListMouCustListedCustFctrByMouCustId, { Id: this.MouCustId }).subscribe(
          (response) => {
            this.listedCusts = response[CommonConstant.ReturnObj];
          }
        );
        this.spinner.hide();
        this.toastr.successMessage(response["message"]);
      }
    ).catch((error) => {});
  }

  openView(custNo) {
    this.CustNoObj.CustNo = custNo;
    this.httpClient.post(URLConstant.GetCustByCustNo, this.CustNoObj).subscribe(
      response => {
        this.AdInsHelperService.OpenCustomerViewByCustId(response["CustId"]);
      }
    );
  }

  deleteCustFctr(custFctrId, idx) {
    if (this.MouCustIsListedForm.controls["IsListedCust"].value == true) {
      if (confirm(ExceptionConstant.DELETE_CONFIRMATION)) {
        if (custFctrId != 0) {
          var mouListedFctr = new MouCustListedCustFctrObj();
          mouListedFctr.MouListedCustFctrId = custFctrId;
          this.httpClient.post(URLConstant.DeleteMouCustListedCustFctr, { Id: custFctrId}).subscribe(
            (response) => {
              this.toastr.successMessage(response["Message"]);
            }
          );
        }
        var MouCustListedCustFctrObjs = this.MouCustIsListedForm.get("ListCust") as FormArray;
        var no = MouCustListedCustFctrObjs.value[idx].No;
        this.MouCustIsListedForm.removeControl("lookupCustomerForGrp" + no);
        MouCustListedCustFctrObjs.removeAt(idx);
        this.OutputData.emit(MouCustListedCustFctrObjs.getRawValue());
      }
    }
  }

  addListCust(){
    var MouCustListedCustFctrObjs = this.MouCustIsListedForm.get("ListCust") as FormArray;
    var length = MouCustListedCustFctrObjs.value.length;
    console.log(MouCustListedCustFctrObjs);
    var max = 0;
    if(length > 0){
      max = MouCustListedCustFctrObjs.value[length-1].No;
    }
    MouCustListedCustFctrObjs.push(this.addGroup(undefined, max + 1));

    var InputLookupCustomerObj = this.initLookup();
    this.InputLookupCustomerObjs.push(InputLookupCustomerObj);
    this.dictLookup[max + 1] = InputLookupCustomerObj;
  }

  initLookup(){
    var InputLookupCustomerObj = new InputLookupObj();
    InputLookupCustomerObj.urlJson = "./assets/uclookup/MOU/lookupCust_MOUListCustFctr.json";
    InputLookupCustomerObj.pagingJson = "./assets/uclookup/MOU/lookupCust_MOUListCustFctr.json";
    InputLookupCustomerObj.genericJson = "./assets/uclookup/MOU/lookupCust_MOUListCustFctr.json";

    return InputLookupCustomerObj;
  }

  addGroup(mouCustListedCustFctrObj : MouCustListedCustFctrObj, i){
    if(mouCustListedCustFctrObj == undefined) {
      return this.fb.group({
        No: [i],
        MouListedCustFctrId: [0],
        MouCustId: [+this.MouCustId, [Validators.required]],
        CustNo: ['', [Validators.required]],
        CustName: ['', [Validators.required]],
        MrCustTypeCode: ['', [Validators.required]],
        MrCustTypeDescr: [''],
        RowVersion: ['']
      })
    }
    else {
      return this.fb.group({
        No: [i],
        MouListedCustFctrId: [mouCustListedCustFctrObj.MouListedCustFctrId],
        MouCustId: [mouCustListedCustFctrObj.MouCustId, [Validators.required]],
        CustNo: [mouCustListedCustFctrObj.CustNo, [Validators.required]],
        CustName: [mouCustListedCustFctrObj.CustName, [Validators.required]],
        MrCustTypeCode: [mouCustListedCustFctrObj.MrCustTypeCode, [Validators.required]],
        MrCustTypeDescr: [mouCustListedCustFctrObj.MrCustTypeDescr, [Validators.required]],
        RowVersion: [mouCustListedCustFctrObj.RowVersion]
      })
    } 
  }

  CopyCustomer(event, i){
    this.MouCustIsListedForm.controls['ListCust']['controls'][i].patchValue({
      CustNo: event.CustNo,
      CustName: event.CustName,
      MrCustTypeCode: event.MrCustTypeCode,
      MrCustTypeDescr: event.CustTypeView
    });    
    var MouCustListedCustFctrObjs = this.MouCustIsListedForm.get("ListCust") as FormArray;
    this.OutputData.emit(MouCustListedCustFctrObjs.getRawValue());
  }

  changeIsListedCust(){
    this.OutputIsListedCust.emit(this.MouCustIsListedForm.get("IsListedCust"));
  }
}
