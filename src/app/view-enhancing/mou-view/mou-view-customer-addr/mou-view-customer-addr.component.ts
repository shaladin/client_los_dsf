import { Component, Input, OnInit } from '@angular/core';
import { MouCustAddrObj } from 'app/shared/model/mou-cust-addr-obj.model';
import { MouCustPersonalJobDataObj } from 'app/shared/model/mou-cust-personal-job-data-obj.model';

@Component({
  selector: 'app-mou-view-customer-addr',
  templateUrl: './mou-view-customer-addr.component.html'
})
export class MouViewCustomerAddrComponent implements OnInit {

  @Input() MouCustAddrLegalObj: MouCustAddrObj = new MouCustAddrObj();
  @Input() MouCustAddrResidenceObj: MouCustAddrObj = new MouCustAddrObj();
  @Input() MouCustAddrMailingObj: MouCustAddrObj = new MouCustAddrObj();
  @Input() MouCustPersonalJobDataObj: MouCustPersonalJobDataObj = new MouCustPersonalJobDataObj();
  @Input() MouCustType: string;

  mouCustAddrForViewObjs: Array<MouCustAddrObj> = new Array<MouCustAddrObj>();
  
  constructor() { }

  ngOnInit() {
    this.setMouCustAddr();
  }

  checkMouCustPhone(CheckPhnNo) : string{
    let PhnNo = CheckPhnNo == null? "" : CheckPhnNo;
    return PhnNo;
  }

  setMouCustAddr(){
    let mouCustAddrLegal : MouCustAddrObj = new MouCustAddrObj();
    mouCustAddrLegal.MrCustAddrTypeCode = this.MouCustAddrLegalObj.MrCustAddrTypeCode;
    mouCustAddrLegal.FullAddr = this.MouCustAddrLegalObj.Addr + " " + this.MouCustAddrLegalObj.AreaCode3 + " " +
                                this.MouCustAddrLegalObj.AreaCode4 + " " + this.MouCustAddrLegalObj.AreaCode1 + " " +
                                this.MouCustAddrLegalObj.AreaCode2 + " " + this.MouCustAddrLegalObj.City + " " + 
                                this.MouCustAddrLegalObj.Zipcode;
    mouCustAddrLegal.PhoneNo =  this.checkMouCustPhone(this.MouCustAddrLegalObj.PhnArea1) + " - " + this.checkMouCustPhone(this.MouCustAddrLegalObj.Phn1) + " - " + this.checkMouCustPhone(this.MouCustAddrLegalObj.PhnExt1);
    mouCustAddrLegal.PhoneNo2 = this.checkMouCustPhone(this.MouCustAddrLegalObj.PhnArea2) + " - " + this.checkMouCustPhone(this.MouCustAddrLegalObj.Phn2) + " - " + this.checkMouCustPhone(this.MouCustAddrLegalObj.PhnExt2);
    mouCustAddrLegal.MrHouseOwnershipCode = this.MouCustAddrLegalObj.MrHouseOwnershipCode;
    this.mouCustAddrForViewObjs.push(mouCustAddrLegal);

    if(this.MouCustType == "PERSONAL"){
      let mouCustAddrResidence : MouCustAddrObj = new MouCustAddrObj();
      mouCustAddrResidence.MrCustAddrTypeCode = this.MouCustAddrResidenceObj.MrCustAddrTypeCode;
      mouCustAddrResidence.FullAddr = this.MouCustAddrResidenceObj.Addr + " " + this.MouCustAddrResidenceObj.AreaCode3 + " " +
                                  this.MouCustAddrResidenceObj.AreaCode4 + " " + this.MouCustAddrResidenceObj.AreaCode1 + " " +
                                  this.MouCustAddrResidenceObj.AreaCode2 + " " + this.MouCustAddrResidenceObj.City + " " + 
                                  this.MouCustAddrResidenceObj.Zipcode;
      mouCustAddrResidence.PhoneNo = this.checkMouCustPhone(this.MouCustAddrResidenceObj.PhnArea1) + " - " + this.checkMouCustPhone(this.MouCustAddrResidenceObj.Phn1) + " - " + this.checkMouCustPhone(this.MouCustAddrResidenceObj.PhnExt1);
      mouCustAddrResidence.PhoneNo2 = this.checkMouCustPhone(this.MouCustAddrResidenceObj.PhnArea2) + " - " + this.checkMouCustPhone(this.MouCustAddrResidenceObj.Phn2) + " - " + this.checkMouCustPhone(this.MouCustAddrResidenceObj.PhnExt2);
      mouCustAddrResidence.MrHouseOwnershipCode = this.MouCustAddrResidenceObj.MrHouseOwnershipCode;
      this.mouCustAddrForViewObjs.push(mouCustAddrResidence);

      let mouCustAddrJob : MouCustAddrObj = new MouCustAddrObj();
      mouCustAddrJob.MrCustAddrTypeCode = this.MouCustPersonalJobDataObj.MouCustAddrJobObj.MrCustAddrTypeCode;
      mouCustAddrJob.FullAddr = this.MouCustPersonalJobDataObj.MouCustAddrJobObj.Addr + " " + this.MouCustPersonalJobDataObj.MouCustAddrJobObj.AreaCode3 + " " +
                                  this.MouCustPersonalJobDataObj.MouCustAddrJobObj.AreaCode4 + " " + this.MouCustPersonalJobDataObj.MouCustAddrJobObj.AreaCode1 + " " +
                                  this.MouCustPersonalJobDataObj.MouCustAddrJobObj.AreaCode2 + " " + this.MouCustPersonalJobDataObj.MouCustAddrJobObj.City + " " + 
                                  this.MouCustPersonalJobDataObj.MouCustAddrJobObj.Zipcode;
      mouCustAddrJob.PhoneNo = this.checkMouCustPhone(this.MouCustPersonalJobDataObj.MouCustAddrJobObj.PhnArea1) + " - " + this.checkMouCustPhone(this.MouCustPersonalJobDataObj.MouCustAddrJobObj.Phn1) + " - " + this.checkMouCustPhone(this.MouCustPersonalJobDataObj.MouCustAddrJobObj.PhnExt1);
      mouCustAddrJob.PhoneNo2 = this.checkMouCustPhone(this.MouCustPersonalJobDataObj.MouCustAddrJobObj.PhnArea2) + " - " + this.checkMouCustPhone(this.MouCustPersonalJobDataObj.MouCustAddrJobObj.Phn2) + " - " + this.checkMouCustPhone(this.MouCustPersonalJobDataObj.MouCustAddrJobObj.PhnExt2);
      mouCustAddrJob.MrHouseOwnershipCode = this.MouCustPersonalJobDataObj.MouCustAddrJobObj.MrHouseOwnershipCode;
      this.mouCustAddrForViewObjs.push(mouCustAddrJob);
    }


    let mouCustAddrMailing : MouCustAddrObj = new MouCustAddrObj();
    mouCustAddrMailing.MrCustAddrTypeCode = this.MouCustAddrMailingObj.MrCustAddrTypeCode;
    mouCustAddrMailing.FullAddr = this.MouCustAddrMailingObj.Addr + " " + this.MouCustAddrMailingObj.AreaCode3 + " " +
                                this.MouCustAddrMailingObj.AreaCode4 + " " + this.MouCustAddrMailingObj.AreaCode1 + " " +
                                this.MouCustAddrMailingObj.AreaCode2 + " " + this.MouCustAddrMailingObj.City + " " + 
                                this.MouCustAddrMailingObj.Zipcode;
    mouCustAddrMailing.PhoneNo = this.checkMouCustPhone(this.MouCustAddrMailingObj.PhnArea1) + " - " + this.checkMouCustPhone(this.MouCustAddrMailingObj.Phn1) + " - " + this.checkMouCustPhone(this.MouCustAddrMailingObj.PhnExt1);
    mouCustAddrMailing.PhoneNo2 = this.checkMouCustPhone(this.MouCustAddrMailingObj.PhnArea2) + " - " + this.checkMouCustPhone(this.MouCustAddrMailingObj.Phn2) + " - " + this.checkMouCustPhone(this.MouCustAddrMailingObj.PhnExt2);
    mouCustAddrMailing.MrHouseOwnershipCode = this.MouCustAddrMailingObj.MrHouseOwnershipCode;
    this.mouCustAddrForViewObjs.push(mouCustAddrMailing);


  }

}
