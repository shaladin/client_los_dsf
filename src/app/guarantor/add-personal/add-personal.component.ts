import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { UcLookupObj } from 'app/shared/model/UcLookupObj.Model';

@Component({
  selector: 'app-add-personal',
  templateUrl: './add-personal.component.html',
  styleUrls: ['./add-personal.component.scss'],
  providers: [NGXToastrService]
})
export class AddPersonalComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient,private fb:FormBuilder, private toastr: NGXToastrService) { 
    this.route.queryParams.subscribe(params => {
      this.mode = params["mode"];
      if (this.mode == "edit") {
        var tempCrit = new CriteriaObj();
        tempCrit.propName = this.key;
        tempCrit.restriction = "Eq";
        tempCrit.value = this.param;
        this.criteria.push(tempCrit);
      }
    })
  }
  param: string;
  mode: string = "add";
  key: any;
  criteria: CriteriaObj[] = [];
  resultData : any;
  inputLookupObj : any;
  MrCustomerRelationship:any;
  MrIdType:any;

  PersonalForm = this.fb.group({
    GuarantorName:[''],
    MrCustomerRelationship: [''],
    MrIdType: [''],
    MrGender: [''],
    IdNo: [''],
    MrMaritalStatus: [''],
    IdExpDate: [''],
    MrNationality: [''],
    BirthPlace: [''],
    BirthDt: [''],
    CountryCode: [''],
    TaxIdNo: [''],
    MrReligion: [''],
    MobilePhnNo: ['']
  });

  ngOnInit() {
    this.inputLookupObj = new UcLookupObj();
    this.inputLookupObj.urlJson = "./assets/uclookup/lookupGuarantorName.json";
    this.inputLookupObj.urlEnviPaging = "http://r3app-server.ad-ins.com/FOUNDATION_R3";
    this.inputLookupObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.inputLookupObj.deleteUrl = "/RefBank/DeleteRefBank";
    this.inputLookupObj.pagingJson = "./assets/uclookup/lookupGuarantorName.json";
    this.inputLookupObj.genericJson = "./assets/uclookup/lookupGuarantorName.json";

    var refCustRelObj ={
      RefMasterTypeCode:"CUST_PERSONAL_RELATIONSHIP",
      RowVersion:""
    }
    var idTypeObj ={
      RefMasterTypeCode:"ID_TYPE",
      RowVersion:""
    }
    this.http.post("http://r3app-server/FOUNDATION_R3/RefMaster/GetListActiveRefMaster", idTypeObj).subscribe(
      (response) => {
          this.MrIdType = response["ReturnObject"];
          this.PersonalForm.patchValue({
            MrIdType: this.MrIdType[0].MasterCode
          });
      }
    );
    this.http.post("http://r3app-server/FOUNDATION_R3/RefMaster/GetListActiveRefMaster", refCustRelObj).subscribe(
      (response) => {
          this.MrCustomerRelationship = response["ReturnObject"];
          this.PersonalForm.patchValue({
            MrCustomerRelationship: this.MrCustomerRelationship[0].MasterCode
          });
      }
    );
  }
  GuarantorName="";
  handleOutput(event){
    console.log(event);
    this.PersonalForm.patchValue(
      {
        GuarantorName: event.GuarantorName
      }
    );
    console.log(this.PersonalForm);
    this.inputLookupObj.nameSelect = event.CustName;
    this.inputLookupObj.idSelect = event.CustName;
  }

}
