import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ControlContainer, FormGroup, FormGroupDirective, NgForm } from '@angular/forms';
import { UcDropdownListCallbackObj, UcDropdownListObj } from 'app/shared/model/library/UcDropdownListObj.model';
@Component({
  selector: 'app-uc-testing',
  templateUrl: './uc-testing.component.html',
  styleUrls: ['./uc-testing.component.css'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class UcTestingComponent implements OnInit {

  @Input() dropdownListObj: UcDropdownListObj = new UcDropdownListObj();
  @Input() parentForm: FormGroup;
  @Input() groupName: any;
  @Input() enjiForm: NgForm;
  @Input() genericList: Array<Object> = new Array<Object>();
  @Input() identifier: string = "ddlGeneric";
  @Output() callback: EventEmitter<UcDropdownListCallbackObj> = new EventEmitter<UcDropdownListCallbackObj>();
  @Input() isDisabled: string = "";

  ApiUrl: string = "";

  constructor(private http: HttpClient) { }

  ngOnInit() {
    console.log("ucddl");
    if (this.dropdownListObj.apiUrl != undefined && this.dropdownListObj.apiUrl != "") {
      this.ApiUrl = this.dropdownListObj.apiUrl;
    } else {
      this.ApiUrl = this.dropdownListObj.enviromentUrl + this.dropdownListObj.apiPath;
    }

    if ((this.dropdownListObj.isCustomList == undefined || !this.dropdownListObj.isCustomList) && this.genericList.length == 0) {
      this.http.post<Array<Object>>(this.ApiUrl, this.dropdownListObj.requestObj).subscribe(
        (response) => {
          if (this.dropdownListObj.isObject) {
            if (response[this.dropdownListObj.customObjName] != undefined) {
              this.genericList = response[this.dropdownListObj.customObjName];
            } else {
              this.genericList = [];
            }

          } else {
            this.genericList = response;
          }
          // if (this.genericList == undefined) {

          // }
          // perlu isReady untuk tipe ini karna overlapping patchvalue
          if ((this.parentForm.value[this.identifier] == null || this.parentForm.value[this.identifier] == "") && (this.dropdownListObj.ddlType == "" || this.dropdownListObj.ddlType == "blank")) {
            this.parentForm.controls[this.identifier].patchValue(this.genericList[0][this.dropdownListObj.customKey]);
          }
          if (this.genericList.length == 1) {
            this.parentForm.controls[this.identifier].patchValue(this.genericList[0][this.dropdownListObj.customKey]);
            this.onSelectOpt(this.genericList[0][this.dropdownListObj.customKey]);
          }
        },
        (error) => {
          console.log(error);
        });
    } else if (this.genericList.length == 1) {
      this.parentForm.controls[this.identifier].patchValue(this.genericList[0][this.dropdownListObj.customKey]);
      this.onSelectOpt(this.genericList[0][this.dropdownListObj.customKey]);
    } else {
      // perlu isReady untuk tipe ini karna overlapping patchvalue
      if (this.parentForm.value[this.identifier] == "" && (this.dropdownListObj.ddlType == "" || this.dropdownListObj.ddlType == "blank")) {
        this.parentForm.controls[this.identifier].patchValue(this.genericList[0][this.dropdownListObj.customKey]);
      }
    }
  }

  onSelectOpt(ev: string) {
    if (this.dropdownListObj.isSelectOutput != undefined && this.dropdownListObj.isSelectOutput) {
      let selectedObj;
      for (let j = 0; j < this.genericList.length; j++) {
        if (this.genericList[j][this.dropdownListObj.customKey] == ev) {
          selectedObj = this.genericList[j];
          break;
        }
      }
      let selectedOutput: UcDropdownListCallbackObj = {
        selectedValue: ev,
        selectedObj: selectedObj
      };
      this.callback.emit(selectedOutput);
    }
  }

  clickMe() {
    console.log(this.parentForm);
  }
}
