import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { InputInsuranceObj } from 'app/shared/model/input-insurance-obj.model';

@Component({
  selector: 'app-insurance-data',
  templateUrl: './insurance-data.component.html',
  styleUrls: ['./insurance-data.component.css']
})

export class InsuranceDataComponent implements OnInit {
  @Input() appId: number;
  @Input() showCancel: boolean = true;
  @Output() outputTab: EventEmitter<any> = new EventEmitter();
  @Output() outputCancel: EventEmitter<any> = new EventEmitter();
  inputInsuranceObj: InputInsuranceObj = new InputInsuranceObj();

  constructor(
    private route: ActivatedRoute, 
    private http: HttpClient,
    private toastr: NGXToastrService) {
    this.route.queryParams.subscribe(params => {
      if (params["AppId"] != null) this.appId = params["AppId"];
    })
  }
  
  async ngOnInit() {
    this.inputInsuranceObj.AppId = this.appId;
    this.inputInsuranceObj.IsMultiAsset = false;
    this.inputInsuranceObj.ShowCancel = this.showCancel;
    this.inputInsuranceObj.IsReady = true;
  }

  SaveForm(event: any) {
    if(event.Action == "Save"){
      this.http.post(URLConstant.AddEditInsuranceData, event.InsuranceData).subscribe(
        (response) => {
          this.toastr.successMessage(response["Message"]);
        });
    }
    this.outputTab.emit();
  }

  Cancel() {
    this.outputCancel.emit();
  }
}