import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-change-mou-detail',
  templateUrl: './change-mou-detail.component.html'
})
export class ChangeMouDetailComponent implements OnInit {
  @Input() ChangeMouTrxId: number;
  @Input() MouCustId: number;
  @Input() MouType: string;

  isDataAlreadyLoaded: boolean = false;

  viewMainDataObj: UcViewGenericObj = new UcViewGenericObj();
  arrValue = [];

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService) { 
    
  }

  ngOnInit() {
    this.arrValue.push(this.ChangeMouTrxId);
    this.arrValue.push(this.MouCustId);
    if (this.MouType == CommonConstant.DEALERFINANCING) {
      this.viewMainDataObj.viewInput = "./assets/ucviewgeneric/viewChangeMouDetailFinancing.json";
      this.viewMainDataObj.viewEnvironment = environment.losUrl;
      this.viewMainDataObj.whereValue = this.arrValue;
    }
    else if(this.MouType == CommonConstant.FACTORING){
      this.viewMainDataObj.viewInput = "./assets/ucviewgeneric/viewChangeMouDetailFactoring.json";
      this.viewMainDataObj.viewEnvironment = environment.losUrl;
      this.viewMainDataObj.whereValue = this.arrValue;
    }
    else if(this.MouType == CommonConstant.GENERAL){
      this.viewMainDataObj.viewInput = "./assets/ucviewgeneric/viewChangeMouDetailGeneral.json";
      this.viewMainDataObj.viewEnvironment = environment.losUrl;
      this.viewMainDataObj.whereValue = this.arrValue;
    }
    
    this.isDataAlreadyLoaded = true;
  }
}
