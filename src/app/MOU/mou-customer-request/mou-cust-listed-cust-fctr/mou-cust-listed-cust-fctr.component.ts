import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormArray, Validators } from '@angular/forms';
import { MouCustListedCustFctrObj } from 'app/shared/model/MouCustListedCustFctrObj.Model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { MouCustListedCustFctrDetailComponent } from './mou-cust-listed-cust-fctr-detail/mou-cust-listed-cust-fctr-detail.component';
import { environment } from 'environments/environment';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';

@Component({
  selector: 'app-mou-cust-listed-cust-fctr',
  templateUrl: './mou-cust-listed-cust-fctr.component.html'
})
export class MouCustListedCustFctrComponent implements OnInit {
  @Input() MouCustId: number;
  @Input() IsListedCustFctr: boolean;
  @Output() OutputData: EventEmitter<any> = new EventEmitter();
  listedCusts: Array<MouCustListedCustFctrObj>;
  inputLookupObj: InputLookupObj;
  dictLookup: {[key: string]: any;} = {};
  InputLookupCustomerObjs: Array<InputLookupObj> = new Array<InputLookupObj>();

  MouCustIsListedForm = this.fb.group({
    IsListedCust: [''],
    ListCust: this.fb.array([]),
  });

  constructor(
    private httpClient: HttpClient,
    private modalService: NgbModal,
    private toastr: NGXToastrService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.MouCustIsListedForm.patchValue({
      IsListedCust: this.IsListedCustFctr
    });
    var mouListedFctr = new MouCustListedCustFctrObj();
    mouListedFctr.MouCustId = this.MouCustId;
    this.httpClient.post<Array<MouCustListedCustFctrObj>>(URLConstant.GetListMouCustListedCustFctrByMouCustId, { Id: this.MouCustId }).subscribe(
      (response) => {
        this.listedCusts = response;
        var MouCustListedCustFctrObjs = this.MouCustIsListedForm.get("ListCust") as FormArray;
        for (let i = 0; i < this.listedCusts.length; i++) {
          MouCustListedCustFctrObjs.push(this.addGroup(this.listedCusts[i], i));

          var InputLookupCustomerObj = this.initLookup();
          this.InputLookupCustomerObjs.push(InputLookupCustomerObj);
          this.dictLookup[i] = InputLookupCustomerObj;
          this.setCustName(i, this.listedCusts[i].CustNo);
        }
        this.OutputData.emit(MouCustListedCustFctrObjs.getRawValue());
      });   
  }

  async setCustName(i, custNo){
    await this.http.post(URLConstant.GetCustByCustNo, {TrxNo: custNo}).toPromise().then(
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
      });
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
            this.listedCusts = response["mouCustListedCustFctrObjs"];
          }
        );
        this.spinner.hide();
        this.toastr.successMessage(response["message"]);
      }
    ).catch((error) => {
    });
  }

  openView(custNo) {
    var link: string;
    this.httpClient.post(URLConstant.GetCustByCustNo, {TrxNo : custNo}).subscribe(
      response => {
        AdInsHelper.OpenCustomerViewByCustId(response["CustId"]);
      });
  }

  deleteCustFctr(custFctrId, idx) {
    if (this.MouCustIsListedForm.controls["IsListedCust"].value == true) {
      if (confirm(ExceptionConstant.DELETE_CONFIRMATION)) {
        if (custFctrId != 0) {
          var mouListedFctr = new MouCustListedCustFctrObj();
          mouListedFctr.MouListedCustFctrId = custFctrId;
          this.httpClient.post(URLConstant.DeleteMouCustListedCustFctr, { Id: custFctrId}).subscribe(
            (response: any) => {
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
    InputLookupCustomerObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    InputLookupCustomerObj.urlEnviPaging = environment.FoundationR3Url;
    InputLookupCustomerObj.pagingJson = "./assets/uclookup/MOU/lookupCust_MOUListCustFctr.json";
    InputLookupCustomerObj.genericJson = "./assets/uclookup/MOU/lookupCust_MOUListCustFctr.json";
    InputLookupCustomerObj.ddlEnvironments = [
      {
        name: "A.MR_CUST_TYPE_CODE",
        environment: environment.FoundationR3Url
      }
    ];

    return InputLookupCustomerObj;
  }

  addGroup(mouCustListedCustFctrObj : MouCustListedCustFctrObj, i){
    if(mouCustListedCustFctrObj == undefined){
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
    }else{
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
    });    
    var MouCustListedCustFctrObjs = this.MouCustIsListedForm.get("ListCust") as FormArray;
    this.OutputData.emit(MouCustListedCustFctrObjs.getRawValue());
  }
}
