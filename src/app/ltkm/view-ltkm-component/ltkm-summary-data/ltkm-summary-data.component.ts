import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { SummaryAppObj } from 'app/shared/model/apps/summary-app-obj.model';
import { SerialNoObj } from 'app/shared/model/serial-no/serial-no-obj.model';
import { InputGridObj } from 'app/shared/model/input-grid-obj.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { UcViewGenericObj } from 'app/shared/model/uc-view-generic-obj.model';
import { environment } from 'environments/environment';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';

@Component({
    selector: "view-ltkm-summary-app",
    templateUrl: "./ltkm-summary-data.component.html",
    providers: [NGXToastrService]    
})

export class ViewLtkmSummaryDataComponent implements OnInit {
    @Input() LtkmCustId: number = 0;
    SummaryLtkmObj: any;
    SummaryLtkmReqObj: any;
    SummaryRefProfesionObj: any;
    ProfessionCode: string;    
    MrDpSrcPaymentForMasterCode: string;
    MrInstSrcPaymentForMasterCode: string ;    
    AppId: string;
    AgrmntNo: string;
    DescDpSrcPayment: any;
    DescInstSrcPayment: any;
    AgrmntId: string;           
    UrlAppView : string = environment.losR3Web + NavigationConstant.VIEW_APP;
    UrlAgrmntView: string = environment.losR3Web + NavigationConstant.VIEW_AGRMNT;    
    Job: string = "";
    Age: number = 0;

    constructor(private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder, private router: Router) {
    }
    ngOnInit() {        
        this.http.post(URLConstant.GetSummaryByLtkmCustId, { Id: this.LtkmCustId }).pipe()
            .subscribe(
                (response) => {                    
                    this.SummaryLtkmObj = response;  
                    this.Age = calculateAge(this.SummaryLtkmObj['rLtkmCustPersonalObj']['BirthDt']);
                    this.http.post(URLConstant.GetRefProfessionByCode, { Code: response["rLtkmCustPersonalJobData"]["MrProfessionCode"] }).pipe()
                    .subscribe( response2 => {                        
                        this.Job = response2["ProfessionName"];
                    })
                }
            );

        function calculateAge(sqlString){
            let string = sqlString
            let slicedString = string.slice(0,10);
            var pattern = /(\d{4})\.(\d{2})\.(\d{2})/;
            var dt = new Date(slicedString.replace(pattern,'$2-$1-$3'));                
            let now = new Date()                
            let dif = now.getTime() - dt.getTime()
            let month = new Date(dif)                
            let year = month.getUTCFullYear()
            let finalresult =  Math.abs(year - 1970);  
            return finalresult;
        }
      
        this.http.post(URLConstant.getLtkmReqByLtkmCustId, { Id: this.LtkmCustId }).pipe()
        .subscribe( response => {
            this.SummaryLtkmReqObj = response;                   
            this.ProfessionCode = response["ReturnObject"]["OwnerProfessionCode"]                    
            this.MrInstSrcPaymentForMasterCode = response["ReturnObject"]["MrInstSrcPayment"]                              
            this.MrDpSrcPaymentForMasterCode = response["ReturnObject"]["MrDpSrcPayment"]
            this.AppId = response["ReturnObject"]["AppId"]
            this.AgrmntNo = response["ReturnObject"]["AgrmntNo"]                                
            this.http.post(URLConstant.GetAgrmntByAgrmntNo, { TrxNo: this.AgrmntNo }).pipe()
                .subscribe( response => {
                    this.AgrmntId = response["AgrmntId"]                                                   
            })
            this.http.post(URLConstant.GetRefProfessionByCode, { Code: this.ProfessionCode }).pipe()
            .subscribe( response => {
                this.SummaryRefProfesionObj = response;                                  
            });
            this.http.post(URLConstant.GetRefMasterByRefMasterTypeCodeAndMasterCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeCspUslAml, MasterCode: this.MrInstSrcPaymentForMasterCode }).pipe()
            .subscribe( response => {                        
                this.DescInstSrcPayment = response;                    
            })
            this.http.post(URLConstant.GetRefMasterByRefMasterTypeCodeAndMasterCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeCspUslAml, MasterCode: this.MrDpSrcPaymentForMasterCode }).pipe()
            .subscribe( response => {                        
                this.DescDpSrcPayment = response;                                               
            })
            }
        );            
    }
}
