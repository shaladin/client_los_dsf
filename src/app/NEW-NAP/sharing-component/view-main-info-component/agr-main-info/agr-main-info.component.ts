import { Component, OnInit, Input } from '@angular/core';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';

@Component({
  selector: 'app-agr-main-info',
  templateUrl: './agr-main-info.component.html'
})
export class AgrMainInfoComponent implements OnInit {

  viewObj: string;
  @Input() arrValue = [];
 
  constructor(
    private router: Router ) { }

  ngOnInit() {
    this.viewObj = "./assets/ucviewgeneric/viewAgrMainInfo.json";
  }
  
  GetCallBack(ev: any){
    if(ev.Key == "ViewProdOffering"){ 
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion( ev.ViewObj.ProdOfferingCode, ev.ViewObj.ProdOfferingVersion);  
    }
  }

}