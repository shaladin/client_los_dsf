import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie';
import { InputSearchObj } from 'app/shared/model/input-search-obj.model';
import { environment } from 'environments/environment';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  inputObj: InputSearchObj = new InputSearchObj();
  pageSize: number = 10;

  constructor(private fb: FormBuilder, public translate: TranslateService, private toastr: ToastrService, private http: HttpClient,  private cookieService: CookieService) {

  }

  ngOnInit() {
    this.inputObj._url = "./assets/ucpaging/product/searchProductHO.json";
    this.inputObj.enviromentUrl = environment.losUrl + "/v2";
    this.inputObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;
  }

  getResult(ev) {
    console.log(ev);
  }
}
