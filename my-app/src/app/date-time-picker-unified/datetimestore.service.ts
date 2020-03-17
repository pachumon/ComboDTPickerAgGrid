import { Injectable } from "@angular/core";

@Injectable()
export class DateTimeStoreService {
  clearDate: boolean = false;

  ToggleClearDate = (isClearSet: boolean) => {
    this.clearDate = isClearSet;
  };
}
