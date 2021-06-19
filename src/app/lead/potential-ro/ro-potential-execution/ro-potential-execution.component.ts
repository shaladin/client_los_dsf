import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from 'environments/environment';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { HttpClient } from '@angular/common/http';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { UcTempPagingObj } from 'app/shared/model/TempPaging/UcTempPagingObj.model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import * as XLSX from 'xlsx';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-ro-potential-execution',
  templateUrl: './ro-potential-execution.component.html'
})
export class RoPotentialExecutionComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private toastr: NGXToastrService,
    private router: Router,
    private route: ActivatedRoute) { }

  TempPagingObj: UcTempPagingObj;
  ListSelectedRo: Array<any>;
  ListResultToExcelHeader: Array<Array<string>> = [];
  ListResultToExcelData: Array<Array<string>> = [];

  ngOnInit() {
    this.initAddToTempPaging();
  }

  initAddToTempPaging() {
    this.TempPagingObj = new UcTempPagingObj();
    this.TempPagingObj.urlJson = "./assets/ucpaging/ucTempPaging/RoPotentialExecutionTempPaging.json";
    this.TempPagingObj.enviromentUrl = environment.losUrl;
    this.TempPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;
    this.TempPagingObj.pagingJson = "./assets/ucpaging/ucTempPaging/RoPotentialExecutionTempPaging.json";
    this.TempPagingObj.isReady = true;
  }

  CallbackTempPaging(ev) {
    this.ListSelectedRo = ev.TempListObj;

  }

  CallbackCust(ev) {
    if (ev.Key == "customer") {
      this.http.post(URLConstant.GetCustByCustNo, { CustNo: ev.RowObj.CustNo }).subscribe(
        (response) => {
          AdInsHelper.OpenCustomerViewByCustId(response['CustId']);
        }
      )
    }
  }

  async onClickExecute() {
    if (this.ListSelectedRo.length == 0) {
      this.toastr.errorMessage(ExceptionConstant.ADD_MIN_1_DATA);
      return;
    }

    let reqListRoPotentialId: Array<number> = [];
    for (let index = 0; index < this.ListSelectedRo.length; index++) {
      reqListRoPotentialId.push(this.ListSelectedRo[index].RoPotentialId)
    }

    this.http.post(URLConstant.ExecutePotentialRo, { ListRoPotentialIds: reqListRoPotentialId }).subscribe(
      response => {
        this.ListResultToExcelHeader = [];
        this.ListResultToExcelHeader.push(['ORI_OFFICE_CODE', 'CRT_OFFICE_CODE', 'LOB_CODE', 'CUST_NO', 'CUST_NAME', 'MR_CUST_MODEL_CODE', 'MR_ID_TYPE_CODE', 'ID_NO', 'TAX_ID_NO', 'BIRTH_PLACE', 'BIRTH_DT', 'MR_GENDER_CODE', 'MOBILE_PHN_NO_1']);

        // this.ListResultToExcelHeader.push(['String(50)', 'String(50)', 'String(50)', 'String(50)', 'String(500)', 'String(50)', 'String(50)', 'String(50)', 'String(50)', 'String(100)', 'date', 'String(50)', 'String(50)']);
        // this.ListResultToExcelHeader.push(['NOT NULL', 'NOT NULL', 'NOT NULL', 'NULL', 'NOT NULL', 'NOT NULL', 'NOT NULL', 'NOT NULL', 'NULL', 'NOT NULL', 'NOT NULL', 'NOT NULL', 'NOT NULL']);
        // this.ListResultToExcelHeader.push(['Refer ke Table REF_OFFICE', 'Refer ke Table REF_OFFICE', 'Refer ke Table REF_LOB', 'Refer ke Table Customer', 'Nama Customer / Company', 'Refer ke REF_MASTER dengan Ref Master Type Code CUST_MODEL', 'Refer ke REF_MASTER dengan Ref Master Type Code ID_TYPE', 'Nomor Identitas', 'Nomor NPWP', 'Tempat Lahir', 'Tanggal Lahir, Format tanggal "yyyy-MM-dd"', 'Refer ke REF_MASTER dengan Ref Master Type Code GENDER', 'Nomor handphone']);
        this.ListResultToExcelData = response['ListRoPotentialObjs'].map(obj => {
          let arr = [];
          Object.keys(obj).forEach(key => arr.push(obj[key]));
          return arr;
        });
        this.toastr.successMessage(response['message']);
        this.exportTableElmToExcel('RO Potential')
        this.TempPagingObj.isReady = false;
        this.ListSelectedRo = [];
        setTimeout(() => { this.initAddToTempPaging() }, 500);
      }
    );
  }

  public exportTableElmToExcel(fileName: string): void {
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.ListResultToExcelHeader.concat(this.ListResultToExcelData));
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, ws, 'Sheet1');
    XLSX.writeFile(workbook, fileName + '.xlsx');
  }
}
