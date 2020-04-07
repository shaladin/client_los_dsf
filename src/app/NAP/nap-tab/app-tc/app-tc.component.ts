import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormArray, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { AppIdObj } from 'app/shared/model/AppIdObj.Model';
import { AppTCObj } from 'app/shared/model/AppTCObj.Model';

@Component({
  selector: 'app-app-tc',
  templateUrl: './app-tc.component.html',
  styleUrls: []
})
export class AppTcComponent implements OnInit {

  @Input() AppId: any;
  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private fb: FormBuilder, private toastr: NGXToastrService) {
    this.route.queryParams.subscribe(params => {
      this.AppId = params["AppId"];
    })
   }

   AppTcForm = this.fb.group({
     AppTc: this.fb.array([])
   });


  AppIdObj : any = new AppIdObj();
  AppTcCodeObj ={
    TcCode : new Array(),
    RowVersion:""
  }
  result : any;
  DocName = new Array();
  listAppTcObj : Array<AppTCObj> = new Array<AppTCObj>();

  ngOnInit() {
    this.AppIdObj.AppId = this.AppId;
    console.log(this.AppIdObj);
    this.http.post(AdInsConstant.CreateTCRule, this.AppIdObj).subscribe(
      (response) => {
        console.log("CHek Hasil :");
        console.log(response);
        this.result=response;
        console.log(this.result);
        // this.listAppTcObj = this.result;
        for(let i =0; i <Object.keys(this.result).length ;i++){
          // this.listAppTcObj[i].TcCode = this.result[i]["TCCode"];
          // this.listAppTcObj[i].IsMandatory = this.result[i]["TCMandatory"];
          // this.listAppTcObj[i].PriorTo = this.result[i]["TCPriorTo"];
          var appTcObj =  new AppTCObj();
          appTcObj.IsMandatory = this.result[i].TCMandatory;
          appTcObj.PriorTo = this.result[i].TCPriorTo;
          appTcObj.TcCode = this.result[i].TCCode;
          this.listAppTcObj.push(appTcObj);
          var fa_apptc = this.AppTcForm.get("AppTc") as FormArray;
          fa_apptc.push(this.AddTcControl(this.listAppTcObj[i]))
          this.DocName.push(this.result[i].TCCode);
          this.AppTcCodeObj.TcCode[i]=this.DocName[i]; 
        }
        console.log(this.listAppTcObj);
        this.http.post(AdInsConstant.GetListRefTcByTcCode, this.AppTcCodeObj).subscribe(
          (response) => {
            console.log(response);
            for(var i =0;i<Object.keys(response).length;i++){
              this.DocName[i] = response[i]["TcName"];
            }
          }
        );
        
    this.Check();
    this.DisableDate();
    
    var fa_AppTc = this.AppTcForm.get("AppTc") as FormArray
    for (let i = 0; i < fa_AppTc.length ; i++) {
      var item = fa_AppTc.at(i);
      var isMandatory : Boolean = item.get("IsMandatory").value;
      if(isMandatory){
        this.EnablePromiseDt(i);
      }
    }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  AddTcControl(obj : AppTCObj){
    return this.fb.group({
       TcCode: obj.TcCode,
       PriorTo: obj.PriorTo,
       IsChecked: [''],
       IsMandatory: obj.IsMandatory,
       PromisedDt: ['',Validators.required],
       ExpiredDt: [''],
       Notes: [''],
    })
  }

  DisableDate(){
    var fa_AppTc = this.AppTcForm.get("AppTc") as FormArray
    for (let i = 0; i < fa_AppTc.length ; i++) {
      var item = fa_AppTc.at(i);
      item.get("ExpiredDt").disable();
      item.get("PromisedDt").disable();
    }
  }

  EnablePromiseDt(i){
    var fa_AppTc = this.AppTcForm.get("AppTc") as FormArray
      var item = fa_AppTc.at(i);
      item.get("PromisedDt").enable();
  }

  ObjSelected(){
    var fa_AppTc = this.AppTcForm.get("AppTc") as FormArray
    for (let i = 0; i < fa_AppTc.length ; i++) {
      var item = fa_AppTc.at(i);
      var isChecked: Boolean = item.get("IsChecked").value;
      var isMandatory : Boolean = item.get("IsMandatory").value;
      if(isChecked && isMandatory)
      {
        item.get("PromisedDt").disable();
        item.get("ExpiredDt").enable();
        item.get("IsChecked").disable();
      }
      else if(isChecked)
      {
        item.get("ExpiredDt").enable();
        item.get("IsChecked").disable();
      }
    }
  }

  Check(){
    var fa_AppTc = this.AppTcForm.get("AppTc") as FormArray
    for (let i = 0; i < fa_AppTc.length ; i++) {
      var item = fa_AppTc.at(i);
      console.log(item);
    }
  }

  // ObjSelected(event, i) {
  //   // if (event.target.checked) {
  //   //   console.log("event checked");
  //   //   console.log(i+1);
  //   //   console.log(this.AppTc[i+1]);
  //   //   if(this.AppTc[i+1].IsMandatory== true){
  //   //   }
  //   // } else {
  //   //   console.log("event unchecked");
  //   //   console.log(i);
  //   // }
  // }
}
