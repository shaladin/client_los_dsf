import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UcviewgenericComponent } from '@adins/ucviewgeneric';
import { environment } from 'environments/environment';
import { UcViewGenericObj } from 'app/shared/model/uc-view-generic-obj.model';

@Component({
  selector: 'cessie-main-info',
  templateUrl: './cessie-main-info.component.html'
})
export class CessieMainInfoComponent implements OnInit {
  private viewGeneric: UcviewgenericComponent;
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  @Input() CessieHXId: number;
  arrValue = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.arrValue.push(this.CessieHXId);
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewCessieHeader.json";
    this.viewGenericObj.viewEnvironment = environment.losUrl + '/v1';
    this.viewGenericObj.whereValue = this.arrValue;
  }
}
