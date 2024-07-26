export class AppAssetDsfObj {
    Id: number;
    AppId: number;
    AppAssetId: number;

    RunnerActivation: string;
    AppAssetIds: Array<number>;
      constructor() {
      this.Id = 0;
      this.AppId = 0;
      this.AppAssetId = 0;
      
      this.RunnerActivation = "";
      this.AppAssetIds = new Array<number>();
    }
}
