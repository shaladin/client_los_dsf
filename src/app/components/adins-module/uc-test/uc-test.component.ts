import { Component, OnInit, Input, ViewChild, ElementRef, Inject, Renderer2, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FormGroup, NgForm } from '@angular/forms';
import { DatePipe, formatDate } from '@angular/common';
import { DOCUMENT } from '@angular/platform-browser';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { ToastrService } from 'ngx-toastr';
import { ExcelService } from 'app/shared/excel-service/excel-service';
import { InputSearchObj } from 'app/shared/model/input-search-obj.model';
import { KeyValueReportObj } from '@adins/ucsearch/lib/model/key-value-report.model';
import { RequestCriteriaObj } from 'app/shared/model/request-criteria-obj.model';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CookieService } from 'ngx-cookie';
export class KeyValueUCSearchObj {
  key: number;
  value: string;

  constructor() {
      this.key = 0;
      this.value = "";
  }
}
@Component({
  selector: 'app-uc-test',
  templateUrl: './uc-test.component.html',
  styleUrls: ['./uc-test.component.css'],
  providers: [ExcelService, DatePipe],
  animations: [
    trigger('changeDivSize', [
      state('initial', style({
        height: '*',
        opacity: '1',
      })),
      state('final', style({
        height: '0px',
        opacity: '0',
        overflow: 'hidden',
      })),
      transition('initial=>final', animate('300ms')),
      transition('final=>initial', animate('300ms'))
    ]),
  ]
})
export class UcTestComponent implements OnInit {
  // trus nad, bisa ga kalo misalkan gw mau bikin
  // kalo login di cabang IsSelectOne: true
  // kalo login di HO, IsSelectOne: false
  @ViewChild('enjiForm') set content(content: NgForm) {
    if (content) { // initially setter gets called with undefined
      this.searchForm = content;
    }
  }

  @ViewChild('formIdSearch') myForm: ElementRef;
  @Input() searchInput: InputSearchObj = new InputSearchObj();
  @Input() pageSize: number = 10;
  @Input() isReport: boolean = false;
  @Output() result: EventEmitter<any> = new EventEmitter();
  @Output() genRpt: EventEmitter<{ ExportType: number, ElRef: ElementRef }> = new EventEmitter<{ ExportType: number, ElRef: ElementRef }>();
  ExportTypeList: Array<KeyValueReportObj> = [
    {
      key: 0,
      value: "PDF"
    },
    {
      key: 1,
      value: "Excel 2003"
    },
    {
      key: 2,
      value: "Excel 2007"
    },
    {
      key: 3,
      value: "Document"
    },
    {
      key: 4,
      value: "Document XML"
    },
  ];
  ListOfMonth: Array<any> = [
    {
      "key": "1",
      "value": "January"
    },
    {
      "key": "2",
      "value": "February"
    },
    {
      "key": "3",
      "value": "March"
    },
    {
      "key": "4",
      "value": "April"
    },
    {
      "key": "5",
      "value": "May"
    },
    {
      "key": "6",
      "value": "June"
    },
    {
      "key": "7",
      "value": "July"
    },
    {
      "key": "8",
      "value": "August"
    },
    {
      "key": "9",
      "value": "September"
    },
    {
      "key": "10",
      "value": "October"
    },
    {
      "key": "11",
      "value": "November"
    },
    {
      "key": "12",
      "value": "December"
    }
  ];
  ListOfYear: Array<KeyValueUCSearchObj> = new Array<KeyValueUCSearchObj>();
  DictOfMonth: { [month: number]: string } = {};
  ClaimList: Array<any> = [
    {
      Key: AdInsConstant.RestrictionIsNotNull,
      Value: "CLAIMED"
    },
    {
      Key: AdInsConstant.RestrictionIsNull,
      Value: "UNCLAIMED"
    },
  ];

  ExportType: number = 0;

  pageNow: any = 1;
  configuration: any;
  exportData: any;
  ExcelData: any;
  isDataLoaded: boolean = false;
  isHidden: boolean = false;
  BisDt: string;
  BusinessDt: Date = new Date();
  dateWrong: boolean = false;

  currentState = 'initial';

  form: FormGroup;
  countForm = 0;
  formattedAmount = '';
  amount = 0;
  apiUrl: string;
  arrCrit: any;
  searchForm: NgForm;

  constructor(private http: HttpClient, private excelService: ExcelService, private _renderer2: Renderer2,
    @Inject(DOCUMENT) private _document, public toastr: ToastrService, private cookieService: CookieService,
    private datePipe: DatePipe) {
  }

  changeState() {
    this.currentState = this.currentState === 'initial' ? 'final' : 'initial';
    this.isHidden = this.isHidden === false ? true : false;
  }

  ngOnInit() {
    console.log("ucsearch");
    this.DictOfMonth[1]= "January";
    this.DictOfMonth[2]= "February";
    this.DictOfMonth[3]= "March";
    this.DictOfMonth[4]= "April";
    this.DictOfMonth[5]= "May";
    this.DictOfMonth[6]= "June";
    this.DictOfMonth[7]= "July";
    this.DictOfMonth[8]= "August";
    this.DictOfMonth[9]= "September";
    this.DictOfMonth[10]= "October";
    this.DictOfMonth[11]= "November";
    this.DictOfMonth[12]= "December";
    this.apiUrl = this.searchInput.enviromentUrl + this.searchInput.apiQryPaging;
    this.arrCrit = this.searchInput.arrCritObj;
    let js = this._renderer2.createElement('script');
    js.text = `
          $(document).ready(function(){
            $("#flip").click(function(){
              $("#panel").slideToggle("slow");
            });
          });
        `;
    this._renderer2.appendChild(this._document.body, js);

    let value = this.cookieService.get('BusinessDateRaw');
    this.BisDt = this.DecryptString(value, "AdInsFOU12345678");
    this.BusinessDt = new Date(this.BisDt);
    this.initiateForm();
  }

  initiateForm() {
    this.getJSON(this.searchInput._url).subscribe(data => {
      this.configuration = data;
      this.exportData = data.exportExcel;
      if (data.exportTypeList != undefined && data.exportTypeList.length != 0) {
        this.ExportTypeList = data.exportTypeList;
        this.ExportType = this.ExportTypeList[0].key;
      }

      this.countForm = data.component.length;
      this.isDataLoaded = true;

      if (this.searchInput.title != undefined && this.searchInput.title != "") {
        this.configuration.title = this.searchInput.title;
      }

      for (let i = 0; i < this.countForm; i++) {
        //ini kalau datanya di load dari URL
        if (data.component[i].isFromURL == true) {
          let request = new RequestCriteriaObj();
          let arrayCrit = new Array();
          let criteriaObject = new CriteriaObj();
          criteriaObject.DataType = "text";
          criteriaObject.propName = data.component[i].criteriaPropName;
          criteriaObject.value = data.component[i].criteriaPropValue;
          criteriaObject.restriction = "eq";
          arrayCrit.push(criteriaObject);
          request.criteria = arrayCrit;
          request[data.component[i].criteriaPropName] = data.component[i].criteriaPropValue;

          // Pengecekan penggunaan url atau path
          if (data.component[i].path != undefined && data.component[i].path != "") {
            if (this.searchInput.listEnvironments != undefined && this.searchInput.listEnvironments.length != 0) {
              for (let y = 0; y < this.searchInput.listEnvironments.length; y++) {
                if (data.component[i].environment == this.searchInput.listEnvironments[y].environment) {
                  data.component[i].fullpath = this.searchInput.listEnvironments[y].url + data.component[i].path;
                  break;
                }
              }
            } else {
              data.component[i].fullpath = data.component[i].url;
            }

          } else {
            data.component[i].fullpath = data.component[i].url;
          }
          //lempar objectnya sekalian sama urlnya, nnti di bind di dalem karena masalah di asyncnya
          //biar tiap function ada state2nya sendiri
          this.resolveObject(data.component[i], data.component[i].fullpath, request);
        }

        if (data.component[i].type == "numeric") {
          data.component[i].value = parseFloat(data.component[i].value).toLocaleString('en');
        }

        //pengecekan ddl
        if (data.component[i].type == "dropdown") {
          if (data.component[i].dtmType != undefined) {
            if (data.component[i].dtmType.includes("month")) {
              if (data.component[i].value != undefined && data.component[i].value.includes("BD")) {
                data.component[i].value = this.setDefaultValueMonth(data.component[i].value);
              }
              data.component[i].items = this.setMonthDDL(data.component[i].dtmType);
            }
            if (data.component[i].dtmType.includes("year")) {
              if (data.component[i].value != undefined && data.component[i].value.includes("BD")) {
                data.component[i].value = this.setDefaultValueYear(data.component[i].value);
              }
              data.component[i].items = this.setYearDDL(data.component[i].dtmType);
            }
          }
        }
        if (!data.component[i].value) {
          data.component[i].value = "";
          if (data.component[i].ddlType == 'all') data.component[i].value = "all";
          if (data.component[i].ddlType == 'one') data.component[i].value = "one";
        }
        //pengecekan tanggal
        if (data.component[i].type == "datepicker") {
          if (data.component[i].value.includes("BD")) {
            let businessDate = new Date();
            if (this.BisDt != null) {
              businessDate = new Date(this.BisDt);
            }
            let operator = data.component[i].value.charAt(2);
            let dateShow = new Date();
            if (operator == "-") {
              let tempMinus = data.component[i].value.split("-", 2);
              let numDay = parseInt(tempMinus[1]);
              businessDate.setDate(businessDate.getDate() - numDay);
            }
            else if (operator == "+") {
              let tempMinus = data.component[i].value.split("+", 2);
              let numDay = parseInt(tempMinus[1]);
              businessDate.setDate(businessDate.getDate() + numDay);
            }
            dateShow = businessDate;
            let dateText = formatDate(dateShow, 'yyyy-MM-dd', 'en-US')
            data.component[i].value = dateText;
          }

          if (data.component[i].restriction != undefined && data.component[i].restriction != "") {
            if (data.component[i].restriction.toUpperCase() == "GT") {
              let minDate = new Date(this.datePipe.transform(data.component[i].minDate, 'yyyy-MM-dd'));
              minDate.setDate(minDate.getDate() + 1);
              data.component[i].minDate = minDate;
            } else if (data.component[i].restriction.toUpperCase() == "LT") {
              let maxDate = new Date(this.datePipe.transform(data.component[i].maxDate, 'yyyy-MM-dd'));
              maxDate.setDate(maxDate.getDate() - 1);
              data.component[i].maxDate = maxDate;
            }
          }
        }
      }

      setTimeout(() => {
        for (let j = 0; j < this.countForm; j++) {
          if (data.component[j].isEvent == true && this.configuration.component[j].itemsUrl.length == 1) {
            this.onChangeEvent(data.component[j].itemsUrl[0].Key, data.component[j]);
          }
          if (data.component[j].type == "officeRoleCodes" && this.configuration.component[j].itemsUrl.length > 0) {
            this.SetRoleOfficeCodes(j);
          }
        }
      }, 1000);
    });
  }

  SetRoleOfficeCodes(i: number) {
    let value: string = this.cookieService.get("UserAccess");
    let userAccess: string = JSON.parse(this.DecryptString(value, "AdInsFOU12345678"));
    let roleCode: string = userAccess["RoleCode"];
    let listOfficeRoleCodes: Array<string> = new Array();
    listOfficeRoleCodes.push(roleCode);
    let component = this.myForm.nativeElement[i];
    let ddl = component.options;
    let text = ddl[ddl.selectedIndex].value.trim();
    if (this.configuration.component[i].itemsUrl.length == 1 || (this.configuration.component[i].ddlType == 'all' && text == 'all')) {
      for (let index = 0; index < this.configuration.component[i].itemsUrl.length; index++) {
        const element = this.configuration.component[i].itemsUrl[index];
        listOfficeRoleCodes.push(element.Key);
        listOfficeRoleCodes.push(roleCode + "-" + element.Key);
      }
    } else {
      listOfficeRoleCodes.push(text);
      listOfficeRoleCodes.push(roleCode + "-" + text);
    }

    this.searchInput.integrationObj.requestObj["OfficeRoleCodes"] = listOfficeRoleCodes;
  }

  setDefaultValueMonth(value) {
    let businessDate = new Date(this.BusinessDt);
    let operator = value.charAt(2);
    let tempValue = value.split(operator, 2);
    let numMonth = parseInt(tempValue[1]);
    if (!numMonth) numMonth = 1;
    if (operator == "-") {
      businessDate.setMonth(businessDate.getMonth() - numMonth);
    }
    else if (operator == "+") {
      businessDate.setMonth(businessDate.getMonth() + numMonth);
    }
    return businessDate.getMonth();
  }
  setMonthDDL(month) {
    let ListOfMonth: Array<KeyValueUCSearchObj>;
    let equation = month.match("[\\/+][-]|[-][\\/+]|\\/+|-");
    let toMin: number = this.BusinessDt.getMonth();
    let toMax: number = this.BusinessDt.getMonth();
    let tempEquation = equation[0];
    let minMax: number = parseInt(month.substring(equation.index + equation[0].length));
    if (minMax >= 12) return this.ListOfMonth;
    if ((tempEquation == "+-" || tempEquation == "-+") && minMax >= 6) return this.ListOfMonth;
    let dictOfMonth: { [month: number]: string } = this.DictOfMonth;
    ListOfMonth.push({ key: toMin, value: dictOfMonth[toMin] });

    for (let q = 0; q < minMax; q++) {
      if (tempEquation.includes("-")) {
        toMin--;
        if (toMin == 0) toMin = 12;
        ListOfMonth.push({ key: toMin, value: dictOfMonth[toMin] });
      }
      if (tempEquation.includes("+")) {
        toMax++;
        if (toMax == 13) toMax = 1;
        ListOfMonth.push({ key: toMax, value: dictOfMonth[toMax] });
      }
    }
    ListOfMonth.sort((a, b) => {
      return a.key - b.key;
    });
    return ListOfMonth;
  }

  setDefaultValueYear(value) {
    let businessDate = new Date(this.BusinessDt);
    let operator = value.charAt(2);
    let tempValue = value.split(operator, 2);
    let numYear = parseInt(tempValue[1]);
    if (!numYear) numYear = 1;
    if (operator == "-") {
      businessDate.setFullYear(businessDate.getFullYear() - numYear);
    }
    else if (operator == "+") {
      businessDate.setFullYear(businessDate.getFullYear() + numYear);
    }
    return businessDate.getFullYear();
  }
  setYearDDL(year) {
    this.ListOfYear = new Array<KeyValueUCSearchObj>();
    let equation = year.match("[\\/+][-]|[-][\\/+]|\\/+|-");
    let toMin: number = this.BusinessDt.getFullYear();
    let toMax: number = this.BusinessDt.getFullYear();
    let minMax: number = parseInt(year.substring(equation.index + equation[0].length));
    this.ListOfYear.push({ key: this.BusinessDt.getFullYear(), value: this.BusinessDt.getFullYear().toString() });

    for (let q = 0; q < minMax; q++) {
      if (equation[0] == "-+" || equation[0] == "+-") {
        toMin--;
        toMax++;
        this.ListOfYear.push({ key: toMin, value: toMin.toString() }, { key: toMax, value: toMax.toString() });
      } else if (equation[0] == "-") {
        toMin--;
        this.ListOfYear.push({ key: toMin, value: toMin.toString() });
      } else if (equation[0] == "+") {
        toMax++;
        this.ListOfYear.push({ key: toMax, value: toMax.toString() });
      }
    }
    this.ListOfYear.sort((a, b) => {
      return a.key - b.key;
    });
    return this.ListOfYear;
  }

  public getJSON(url: string): Observable<any> {
    return this.http.get(url);
  }

  public postJSON(url: string, criteria: any = null): Observable<any> {
    return this.http.post(url, criteria);
  }

  searchClick() {
    // for(let i=0;i<this.countForm;i++){
    //   if(this.configuration.component[i].type == "datepicker"){
    //     if ((i != (this.countForm-1)) && (this.configuration.component[i].name != this.configuration.component[i+1].name)){
    //       this.checkInputDate(this.configuration.component[i]);
    //     }
    //   }
    // }
    // if(this.dateWrong) return;

    let order = null;
    if (this.configuration.orderby != null) {
      order = {
        key: this.configuration.orderby.key,
        value: this.configuration.orderby.value
      }
    }
    this.pageNow = 1;
    this.search(this.apiUrl, this.pageNow, this.pageSize, order, this.arrCrit);
  }

  reset() {
    this.searchForm.resetForm();
    this.ExportType = this.ExportTypeList[0].key;
    this.initiateForm();
  }

  search(apiUrl: string, pageNo: number, rowPerPage: number, orderBy: any, addCrit: CriteriaObj[] = new Array()) {
    let request = new RequestCriteriaObj();
    let arrCrit = new Array();
    let IsQueryIn = false;
    let IsBreak = false;

    // Inject whereQuery for where criteria
    if (this.searchInput.whereValue != undefined && this.searchInput.whereValue.length != 0) {
      this.configuration.querystring.whereQuery = new Array<any>();
      for (let x = 0; x < this.searchInput.whereValue.length; x++) {
        this.configuration.querystring.whereQuery.push(this.searchInput.whereValue[x].value);
      }
    }
    if (this.searchInput.fromValue != undefined && this.searchInput.fromValue.length != 0) {
      this.configuration.querystring.fromQuery = new Array<any>();
      for (let x = 0; x < this.searchInput.fromValue.length; x++) {
        this.configuration.querystring.fromQuery.push(this.searchInput.fromValue[x].value);
      }
    }
    request.pageNo = pageNo;
    request.rowPerPage = rowPerPage;
    request.orderBy = orderBy;
    request.queryString = this.configuration.querystring;

    for (let i = 0; i < this.countForm; i++) {
      let critObj = new CriteriaObj();
      let component = this.myForm.nativeElement[i];

      // // popup message if required
      // if (component.getAttribute('data-required') != null && component.getAttribute('data-required') == "true") {
      //   let val = component.value.trim();
      //   if (val == "") {
      //     IsBreak = true;
      //     let label = component.getAttribute('label');
      //     this.toastr.warning("Please input " + label);
      //     break;
      //   }
      // }

      critObj.DataType = component.getAttribute('data-type');
      //Ini khusus kalau dari Drop Down
      if (component.getAttribute('query-in') != null && component.getAttribute('query-in') == "true") {
        IsQueryIn = true;
      }
      else {
        IsQueryIn = false;
      }
      if (component.value != "") {
        if (component.nodeName == 'SELECT') {
          let ddl = component.options;
          let text = ddl[ddl.selectedIndex].value.trim();
          if (text == "one") {
            IsBreak = true;
            let label = component.getAttribute('label');
            this.toastr.warning("Please select " + label);
            break;
          }

          if (component.getAttribute('data-crit-datatable') != "" && component.getAttribute('data-crit-datatable') != null) {
            critObj.isCriteriaDataTable = component.getAttribute('data-crit-datatable');
          }
          
          if (this.configuration.component[i].type == "taskDefinitionKey" || 
              this.configuration.component[i].type == "processKey" || 
              this.configuration.component[i].type == "officeRoleCodes") 
              continue;
          
          if (this.configuration.component[i].type == "claim") {
            critObj.propName = component.getAttribute('data-name');
            critObj.restriction = text;
            critObj.value = null;
            arrCrit.push(critObj);
          } else {
            if (text != "all" && text != "one") {
              //Kalau Dari Dropdown udah pasti pake Eq
              critObj.restriction = AdInsConstant.RestrictionEq;
              if (component.name != "") {
                critObj.propName = component.name;
              } else {
                critObj.propName = component.getAttribute('data-name');
              }
              critObj.value = text;
              arrCrit.push(critObj);
            } else if (text == "all" && IsQueryIn == true && component.options.length != 0) {
              let ddlList = new Array();
              for (let x = 0; x < component.options.length; x++) {
                if (x != 0) {
                  ddlList.push(component.options[x].value);
                }
              }
              if (ddlList.length != 0) {
                critObj.restriction = AdInsConstant.RestrictionIn;
                if (component.name != "") {
                  critObj.propName = component.name;
                } else {
                  critObj.propName = component.getAttribute('data-name');
                }
                critObj.listValue = ddlList;
                arrCrit.push(critObj);
              }
            }
          }
        }
        else {
          //Kalau ada Percent maka yang dipake nnti adalah Restrictions Like
          if (component.name != "") {
            critObj.propName = component.name;
          } else {
            critObj.propName = component.getAttribute('data-name');
          }
          critObj.value = component.value.trim();
          if (component.value.includes("%")) {
            critObj.restriction = AdInsConstant.RestrictionLike;
          }
          //kalau componentnya Date, restrictionsnya lgsg ambil dari property JSONnya
          else if (component.getAttribute('data-restriction') != "" && component.getAttribute('data-restriction') != null) {
            critObj.restriction = component.getAttribute('data-restriction');
            if (component.getAttribute('data-type') == 'numeric') {
              critObj.value = parseFloat(component.value.replace(/,/g, '')).toString();
            }
            if (critObj.restriction.toUpperCase() == "LIKE") {
              critObj.value = "%" + component.value.trim() + "%";
              critObj.restriction = AdInsConstant.RestrictionLike
            }
          }
          else {
            critObj.restriction = AdInsConstant.RestrictionEq
          }
          if (component.getAttribute('data-crit-datatable') != "" && component.getAttribute('data-crit-datatable') != null) {
            critObj.isCriteriaDataTable = component.getAttribute('data-crit-datatable');
          }
          arrCrit.push(critObj);
        }
      }
    }

    if (IsBreak) {
      return;
    }

    if (addCrit != null && addCrit != undefined) {
      if (addCrit.length != 0) {
        for (let i = 0; i < addCrit.length; i++) {
          arrCrit.push(addCrit[i]);
        }
      } else if (this.searchInput.addCritInput != null || this.searchInput.addCritInput != undefined) {
        for (let i = 0; i < this.searchInput.addCritInput.length; i++) {
          arrCrit.push(this.searchInput.addCritInput[i]);
        }
      }
    }
    else if (this.searchInput.addCritInput != null || this.searchInput.addCritInput != undefined) {
      for (let i = 0; i < this.searchInput.addCritInput.length; i++) {
        arrCrit.push(this.searchInput.addCritInput[i]);
      }
    }

    request.criteria = arrCrit;

    if (!this.searchInput.isJoinExAPI) {
      request.integrationObj = null;
    } else {
      request.integrationObj = this.searchInput.integrationObj;
    }

    this.http.post(apiUrl, request).subscribe((response) => {
      let qryPaging = {
        response: response,
        pageNow: pageNo
      }
      console.log(qryPaging);
      this.result.emit(qryPaging);
      return response;
    });
  }

  GenerateReport() {
    this.genRpt.emit({ ExportType: this.ExportType, ElRef: this.myForm });
  }

  lessThanFour(): boolean {
    if (this.countForm > 3) {
      return false;
    }
    else {
      return true;
    }
  }

  resolveObject(obj: any, url: string, crit: RequestCriteriaObj = null) {
    const val = this.postJSON(url, crit);
    val.subscribe(tempData => {
      obj.itemsUrl = new Array();
      obj.itemsUrl = tempData.ReturnObject;

      if(obj.exclude != undefined && obj.exclude != ""){
        obj.itemsUrl = obj.itemsUrl.filter((value) => !obj.exclude.includes(value.Key));
      }
    });
  }

  transformAmount(element: any) {
    this.formattedAmount = parseFloat(element.target.value).toLocaleString('en');
    // to show the formatted amount in the textbox.
    element.target.value = this.formattedAmount;
  }

  transformToDecimal(element: any) {
    element.target.value = parseFloat(element.target.value.toString().replace(/,/g, ''));
  }

  exportAsXLSX(): void {
    let request = new RequestCriteriaObj();
    request.pageNo = 1;
    request.rowPerPage = 9999;
    request.orderBy = null;
    request.criteria = [];
    request.queryString = this.configuration.querystring;
    if (!this.searchInput.isJoinExAPI) {
      request.integrationObj = null;
    } else {
      request.integrationObj = this.searchInput.integrationObj;
    }

    this.http.post(this.apiUrl, request).subscribe(
      response => {
        this.ExcelData = response["Data"];
        this.excelService.exportAsExcelFile(this.ExcelData, 'sample');
      },
      (error) => {
        console.log(error);
      });
  }

  onChangeEvent(optValue, afFilter) {
    let jsonComp = this.configuration.component;

    for (let i = 0; i < afFilter.affectedFilter.length; i++) {
      for (let j = 0; j < jsonComp.length; j++) {
        if (jsonComp[j].name == afFilter.affectedFilter[i]) {
          let request = new RequestCriteriaObj();
          let arrayCrit = new Array();

          if (optValue != "all" && optValue != "one") {
            let critObj = new CriteriaObj();
            critObj.DataType = afFilter.datatype;
            if (afFilter.filterPropName != undefined || afFilter.filterPropName != "") {
              request[afFilter.filterPropName] = optValue;
              critObj.propName = afFilter.filterPropName;
            } else {
              critObj.propName = afFilter.name;
              request[afFilter.name] = optValue;
            }
            critObj.value = optValue;
            critObj.restriction = AdInsConstant.RestrictionEq;
            arrayCrit.push(critObj);
          }
          request.criteria = arrayCrit;
          if (jsonComp[j].path != undefined && jsonComp[j].path != "") {
            if (this.searchInput.listEnvironments != undefined && this.searchInput.listEnvironments.length != 0) {
              for (let y = 0; y < this.searchInput.listEnvironments.length; y++) {
                if (jsonComp[j].environment == this.searchInput.listEnvironments[y].environment) {
                  jsonComp[j].fullpath = this.searchInput.listEnvironments[y].url + jsonComp[j].path;
                  break;
                }
              }
            } else {
              jsonComp[j].fullpath = jsonComp[j].url;
            }

          } else {
            jsonComp[j].fullpath = jsonComp[j].url;
          }
          this.resolveObject(jsonComp[j], jsonComp[j].fullpath, request);
        }
      }
    }
  }

  SetProcessKey(idx: number,wfKeyFilter: string) {
    let component = this.myForm.nativeElement[idx];
    let ddl = component.options;
    let text = ddl[ddl.selectedIndex].value.trim();
    if (text) {
      this.searchInput.integrationObj.requestObj[wfKeyFilter] = text;
    }
  }

  switchCase(condList) {
    let condition = false;

    for (let i = 0; i < condList.conditions.length; i++) {
      let idx = this.searchInput.switchValue.findIndex(x => x.property == condList.conditions[i].property);
      if (condList.conditions[i].restriction == "EQ") {
        if (condList.conditions[i].isUser != true) {
          if (this.searchInput.switchValue[idx].value == condList.conditions[i].value) {
            condition = true;
          } else {
            condition = false;
            break;
          }
        } else {
          let username = localStorage.getItem("Username");
          if (this.searchInput.switchValue[idx].value == username) {
            condition = true;
          } else {
            condition = false;
            break;
          }
        }
      } else if (condList.conditions[i].restriction == "NEQ") {
        if (condList.conditions[i].isUser != true) {
          if (this.searchInput.switchValue[idx].value != condList.conditions[i].value) {
            condition = true;
          } else {
            condition = false;
            break;
          }
        } else {
          let username = localStorage.getItem("Username");
          if (this.searchInput.switchValue[idx].value != username) {
            condition = true;
          } else {
            condition = false;
            break;
          }
        }
      } else if (condList.conditions[i].restriction == "GT") {
        if (condList.conditions[i].isUser != true) {
          if (this.searchInput.switchValue[idx].value > condList.conditions[i].value) {
            condition = true;
          } else {
            condition = false;
            break;
          }
        } else {
          let username = localStorage.getItem("Username");
          if (this.searchInput.switchValue[idx].value > username) {
            condition = true;
          } else {
            condition = false;
            break;
          }
        }
      } else if (condList.conditions[i].restriction == "GTE") {
        if (condList.conditions[i].isUser != true) {
          if (this.searchInput.switchValue[idx].value >= condList.conditions[i].value) {
            condition = true;
          } else {
            condition = false;
            break;
          }
        } else {
          let username = localStorage.getItem("Username");
          if (this.searchInput.switchValue[idx].value >= username) {
            condition = true;
          } else {
            condition = false;
            break;
          }
        }
      } else if (condList.conditions[i].restriction == "LT") {
        if (condList.conditions[i].isUser != true) {
          if (this.searchInput.switchValue[idx].value < condList.conditions[i].value) {
            condition = true;
          } else {
            condition = false;
            break;
          }
        } else {
          let username = localStorage.getItem("Username");
          if (this.searchInput.switchValue[idx].value < username) {
            condition = true;
          } else {
            condition = false;
            break;
          }
        }
      } else if (condList.conditions[i].restriction == "LTE") {
        if (condList.conditions[i].isUser != true) {
          if (this.searchInput.switchValue[idx].value <= condList.conditions[i].value) {
            condition = true;
          } else {
            condition = false;
            break;
          }
        } else {
          let username = localStorage.getItem("Username");
          if (this.searchInput.switchValue[idx].value <= username) {
            condition = true;
          } else {
            condition = false;
            break;
          }
        }
      }
    }
    return condition;

  }

  private DecryptString(chipperText: string, chipperKey: string) {
    if (
      chipperKey == undefined || chipperKey.trim() == '' ||
      chipperText == undefined || chipperText.trim() == ''
    ) return chipperText;
    let chipperKeyArr = CryptoJS.enc.Utf8.parse(chipperKey);
    let iv = CryptoJS.lib.WordArray.create([0x00, 0x00, 0x00, 0x00]);
    let decrypted = CryptoJS.AES.decrypt(chipperText, chipperKeyArr, { iv: iv });
    let plainText = decrypted.toString(CryptoJS.enc.Utf8);
    return plainText;
  }

  checkInputDate(component: any) {
    let minDateVal;
    let maxDateVal;
    let label;
    let errorMessage = new Array<string>();

    let MinComponent = this.configuration.component.find(x => x.name == component.name && (x.restriction.toUpperCase() == "GTE")) == undefined ? this.configuration.component.find(x => x.name == component.name && (x.restriction.toUpperCase() == "GT")) : this.configuration.component.find(x => x.name == component.name && (x.restriction.toUpperCase() == "GTE"));
    if (MinComponent != undefined) {
      minDateVal = this.myForm.nativeElement[MinComponent.id].min == "" ? null : new Date(this.myForm.nativeElement[MinComponent.id].min);
      label = MinComponent.label.split(">", 2);
      if (minDateVal != null) {
        if (MinComponent.restriction.toUpperCase() == "GT") {
          minDateVal.setDate(minDateVal.getDate() - 1);
          errorMessage.push(" must be greater than ");
        } else if (MinComponent.restriction.toUpperCase() == "GTE") {
          errorMessage.push(" must be greater than or equals to ");
        }
      }
    }

    let MaxComponent = this.configuration.component.find(x => x.name == component.name && (x.restriction.toUpperCase() == "LTE")) == undefined ? this.configuration.component.find(x => x.name == component.name && (x.restriction.toUpperCase() == "LT")) : this.configuration.component.find(x => x.name == component.name && (x.restriction.toUpperCase() == "LTE"));
    if (MaxComponent != undefined) {
      maxDateVal = this.myForm.nativeElement[MaxComponent.id].max == "" ? null : new Date(this.myForm.nativeElement[MaxComponent.id].max);
      label = MaxComponent.label.split("<", 2);
      if (maxDateVal != null) {
        if (MaxComponent.restriction.toUpperCase() == "LT") {
          maxDateVal.setDate(maxDateVal.getDate() + 1);
          errorMessage.push(" must be less than ");
        } else if (MaxComponent.restriction.toUpperCase() == "LTE") {
          errorMessage.push(" must be less than or equals to ");
        }
      }
    }

    if (minDateVal != null && maxDateVal == null && new Date(this.myForm.nativeElement[MinComponent.id].value) < minDateVal) {
      this.toastr.warning(label[0] + errorMessage[0] + formatDate(minDateVal, 'dd MMMM yyyy', 'en-US') + ".")
      this.dateWrong = true;
    } else if (maxDateVal != null && minDateVal == null && new Date(this.myForm.nativeElement[MaxComponent.id].value) > maxDateVal) {
      this.toastr.warning(label[0] + errorMessage[0] + formatDate(maxDateVal, 'dd MMMM yyyy', 'en-US') + ".")
      this.dateWrong = true;
    } else if (minDateVal != null && maxDateVal != null) {
      if (new Date(this.myForm.nativeElement[MaxComponent.id].value) > maxDateVal || new Date(this.myForm.nativeElement[MinComponent.id].value) < minDateVal) {
        this.toastr.warning(label[0] + errorMessage[0] + formatDate(minDateVal, 'dd MMMM yyyy', 'en-US') + " and" + errorMessage[1] + formatDate(maxDateVal, 'dd MMMM yyyy', 'en-US') + ".")
        this.dateWrong = true;
      } else {
        this.dateWrong = false;
      }
    } else {
      this.dateWrong = false;
    }
  }
}
