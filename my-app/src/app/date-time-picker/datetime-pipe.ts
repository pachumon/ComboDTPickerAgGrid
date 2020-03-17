import { Pipe, PipeTransform } from "@angular/core";
import { DateTimeStoreService } from "./datetimestore.service";

@Pipe({ name: "datetime" })
export class DateTimePipe implements PipeTransform {
  constructor(private store: DateTimeStoreService) {
    console.log(this.store);
  }

  transform(value: string): string {
    console.log(this.store.clearDate);
    if (this.store.clearDate) {
      return "";
    }
    return value;
  }
}
