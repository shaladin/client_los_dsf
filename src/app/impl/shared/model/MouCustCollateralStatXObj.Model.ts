export class MouCustCollateralStatXObj {
   CollateralReceivedDt: Date;
   CollateralReleasedDt: Date;
   CollateralStat: String;

   constructor() {
      this.CollateralReceivedDt = new Date();
      this.CollateralReleasedDt = new Date();
      this.CollateralStat = "";
   }
}
