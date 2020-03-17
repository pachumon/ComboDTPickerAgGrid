import {
  Component,
  OnInit,
  Input,
  forwardRef,
  ViewChild,
  AfterViewInit,
  Injector,
  ElementRef
} from "@angular/core";
import {
  NgbTimeStruct,
  NgbDateStruct,
  NgbPopoverConfig,
  NgbPopover,
  NgbDatepicker,
  NgbCalendar,
  NgbDateAdapter,
  NgbDateParserFormatter,
  NgbTimepicker
} from "@ng-bootstrap/ng-bootstrap";
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor
  //NgControl
} from "@angular/forms";
import { DatePipe } from "@angular/common";
import { DateTimeModel, NgbDateTimeStruct } from "./date-time.model";
import { noop } from "rxjs";
import * as moment from "moment";
import { DateTimeStoreService } from "../date-time-picker/datetimestore.service";
import {
  ICellRendererAngularComp,
  ICellEditorAngularComp
} from "ag-grid-angular";

@Component({
  selector: "app-date-time-picker-unified",
  templateUrl: "./date-time-picker-unified.component.html",
  host: {
    "(document:mousedown)": "onClick($event)"
  },
  styleUrls: ["./date-time-picker-unified.component.scss"],
  providers: [
    DateTimeStoreService,
    DatePipe,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateTimePickerUnifiedComponent),
      multi: true
    }
  ]
})
export class DateTimePickerUnifiedComponent
  implements
    ControlValueAccessor,
    OnInit,
    AfterViewInit,
    ICellEditorAngularComp {
  @Input()
  dateString: string;

  @Input()
  inputDatetimeFormat = "MM/dd/yyyy hh:mm a";
  @Input()
  hourStep = 1;
  @Input()
  minuteStep = 15;
  @Input()
  secondStep = 30;
  @Input()
  seconds = true;
  //this disables the calendar icon in the rendered control
  @Input()
  disabled = false;

  private showTimePickerToggle = false;

  private datetime: DateTimeModel = new DateTimeModel();
  private firstTimeAssign = true;

  private _currentDateShelf: string = null;

  @ViewChild(NgbDatepicker)
  private dp: NgbDatepicker;

  @ViewChild(NgbTimepicker)
  private tp: NgbTimepicker;

  @ViewChild(NgbPopover)
  private popover: NgbPopover;

  cellEditParams;

  agInit(params: any): void {
    this.cellEditParams = params;

    if (moment(params.value).isValid()) {
      this.writeValue(moment(params.value).format("MM/DD/YYYY hh:mm A"));
    } else {
      this.writeValue("");
    }
  }

  getValue(): any {
    if (
      `${this.datetime.hour}-${this.datetime.minute}-${this.datetime.second}` !==
      `23-59-56`
    ) {
      return this.dateString;
    }
    return "";
  }

  private onTouched: () => void = noop;
  private onChange: (_: any) => void = noop;

  private disableTimeSelection: boolean = false;

  public get currentDateShelf(): string {
    console.log(`getter invoked ${this._currentDateShelf}`);
    return this._currentDateShelf;
  }

  public set currentDateShelf(v: string) {
    console.log(`setter invoked ${v}`);
    this._currentDateShelf = v;
    if (
      `${this.datetime.hour}-${this.datetime.minute}-${this.datetime.second}` !==
      `23-59-56`
    ) {
      this.disableTimeSelection = false;
      if (this.tp != undefined) {
        this.tp.model.hour = this.datetime.hour;
        this.tp.model.minute = this.datetime.minute;
      }
    } else {
      this.disableTimeSelection = true;
    }
  }

  //private ngControl: NgControl;

  constructor(
    private config: NgbPopoverConfig,
    private inj: Injector,
    private ngbCalendar: NgbCalendar,
    private datetimestore: DateTimeStoreService,
    private _eref: ElementRef
  ) {
    //config.autoClose = "outside";
    config.placement = "bottom";
  }

  ngOnInit(): void {
    //this.ngControl = this.inj.get(NgControl);
    //console.log(moment().format("DD MM YYYY"));
  }

  ngAfterViewInit(): void {
    this.popover.hidden.subscribe($event => {
      this.showTimePickerToggle = false;
    });
  }

  writeValue(newModel: string) {
    console.log(`write value ${new DateTimeModel()}`);
    if (newModel) {
      //this will when there is an initial model value set
      this.datetime = Object.assign(
        this.datetime,
        DateTimeModel.fromLocalString(newModel)
      );
      this.dateString = newModel;
      this.setDateStringModel();
      this.currentDateShelf = new Date(this.dateString).toString();
      this.datetimestore.ToggleClearDate(false);
    } else {
      //this will when there is no initial model value
      this.datetime = new DateTimeModel();

      this.datetime = DateTimeModel.fromLocalString(
        new Date(`${moment().format("YYYY/MM/DD")} 23:59:56`).toString()
      );
      this.dateString = new Date(
        `${moment().format("YYYY/MM/DD")} 23:59:56`
      ).toString();
      this.currentDateShelf = null;
      this.datetimestore.ToggleClearDate(true);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  toggleDateTimeState($event) {
    this.showTimePickerToggle = !this.showTimePickerToggle;
    $event.stopPropagation();
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  modelChangehandler(modelValue) {
    if (moment(modelValue).isValid() && modelValue.length === 19) {
      let inputChangeValue = { target: { value: modelValue } };
      if (modelValue !== "") {
        this.onInputChange(inputChangeValue);
      }
    }
  }

  onInputChange($event: any) {
    console.log(`input changed ${JSON.stringify($event.target.value)}`);
    //console.error(`date shelf ${this.currentDateShelf}`);
    if ($event.target.value === "") {
      this.datetimestore.ToggleClearDate(true);
      this.datetime = DateTimeModel.fromLocalString(
        new Date(`${moment().format("YYYY/MM/DD")} 23:59:56`).toString()
      );
      this.dateString = new Date(
        `${moment().format("YYYY/MM/DD")} 23:59:56`
      ).toString();
      this.currentDateShelf = null;
      return;
    } else {
      let momentDateObject = moment($event.target.value);
      if (!momentDateObject.isValid() || $event.target.value.length < 19) {
        //do this if currentdateshelf is not null
        if (
          this.currentDateShelf !== null &&
          this.currentDateShelf !== "Invalid Date"
        ) {
          this.datetimestore.ToggleClearDate(false);
          this.datetime = DateTimeModel.fromLocalString(
            moment(`${this.currentDateShelf}`).toString()
          );
          this.setDateStringModel();
          $event.target.value = moment(this.dateString).format(
            "MM/DD/YYYY hh:mm A"
          );
          if (this.dp != undefined) {
            this.dp.navigateTo({
              year: this.datetime.year,
              month: this.datetime.month
            });
          }
        } else {
          //do this if the wrong input is provided with null currentdateshelf
          this.datetime = DateTimeModel.fromLocalString(
            new Date(`${moment().format("YYYY/MM/DD")} 23:59:56`).toString()
          );
          this.dateString = new Date(
            `${moment().format("YYYY/MM/DD")} 23:59:56`
          ).toString();
          this.setDateStringModel();
          $event.target.value = "";
          this.onDateChange({
            year: parseInt(moment().format("YYYY")),
            month: parseInt(moment().format("MM")),
            day: parseInt(moment().format("DD"))
          });
          return;
        }
      } else {
        this.datetimestore.ToggleClearDate(false);
        this.datetime = DateTimeModel.fromLocalString(
          moment(`${$event.target.value}`).toString()
        );
        this.setDateStringModel();
        $event.target.value = moment(this.dateString).format(
          "MM/DD/YYYY hh:mm A"
        );
      }
    }

    const value = $event.target.value;
    const dt = DateTimeModel.fromLocalString(value);

    if (dt) {
      this.datetime = dt;
      if (this.datetime.hour === 11 && this.datetime.minute === 59) {
        //this.datetimestore.ToggleClearDate(true);
        this.datetime.hour = 0;
        this.datetime.minute = 0;
      } else {
        if (this.datetime.minute > 52) {
          this.datetime.hour = this.datetime.hour + 1;
        }
        this.datetime.minute =
          (Math.round(this.datetime.minute / 15) * 15) % 60;
      }
      this.setDateStringModel();
      this.currentDateShelf = new Date(this.dateString).toString();
      $event.target.value = moment(this.dateString).format(
        "MM/DD/YYYY hh:mm A"
      );
    } else if (value.trim() === "") {
      this.datetime = new DateTimeModel();
      this.dateString = "";
      this.onChange(this.dateString);
    } else {
      this.onChange(value);
    }
  }

  onDateChange($event: NgbDateStruct | any) {
    console.log(`date changed ${JSON.stringify($event)}`);
    if (
      // this.datetime.hour !== 23 &&
      // this.datetime.minute !== 59 &&
      // this.datetime.second != 56
      `${this.datetime.hour}-${this.datetime.minute}-${this.datetime.second}` !==
      `23-59-56`
    ) {
      this.datetimestore.ToggleClearDate(false);
    }

    if ($event === null) {
      return;
    }

    if ($event.year) {
      $event = `${$event.year}/${$event.month}/${$event.day}`;
    }

    const date = DateTimeModel.fromLocalString($event);

    if (!date) {
      this.dateString = this.dateString;
      return;
    }

    if (!this.datetime) {
      this.datetime = date;
    }

    this.datetime.year = date.year;
    this.datetime.month = date.month;
    this.datetime.day = date.day;

    if (this.datetime.hour === 23 && this.datetime.minute === 59) {
      //this.datetimestore.ToggleClearDate(true);
      if (this.datetime.second !== 56) {
        this.datetime.hour = 0;
        this.datetime.minute = 0;
      }
    } else {
      if (this.datetime.minute > 52) {
        this.datetime.hour = this.datetime.hour + 1;
      }
      this.datetime.minute = (Math.round(this.datetime.minute / 15) * 15) % 60;
    }
    if (this.dp != undefined) {
      this.dp.navigateTo({
        year: this.datetime.year,
        month: this.datetime.month
      });
    }
    this.setDateStringModel();
    //this for the intial empty model value launch of calendar
    if (
      // this.datetime.hour !== 23 &&
      // this.datetime.minute !== 59 &&
      // this.datetime.second != 56
      `${this.datetime.hour}-${this.datetime.minute}-${this.datetime.second}` !==
      `23-59-56`
    ) {
      this.currentDateShelf = new Date(this.dateString).toString();
    }
  }

  onTimeChange(event: NgbTimeStruct) {
    console.log(`time change ${JSON.stringify(event)}`);
    let previousDate: DateTimeModel;
    if (event === null) {
      previousDate = DateTimeModel.fromLocalString(this.currentDateShelf);
      event.hour = previousDate.hour;
      event.minute = previousDate.minute;
      event.second = previousDate.second;
    }
    this.datetimestore.ToggleClearDate(false);

    this.datetime.hour = event.hour;
    this.datetime.minute = event.minute;
    this.datetime.second = event.second;

    if (this.datetime.minute > 52) {
      this.datetime.hour = this.datetime.hour + 1;
    }
    this.datetime.minute = (Math.round(this.datetime.minute / 15) * 15) % 60;

    this.setDateStringModel();
    this.currentDateShelf = new Date(this.dateString).toString();
  }

  setDateStringModel() {
    console.log(this.datetime);
    this.dateString = this.datetime.toString();

    if (!this.firstTimeAssign) {
      this.onChange(this.dateString);
    } else {
      // Skip very first assignment to null done by Angular
      if (this.dateString !== null) {
        this.firstTimeAssign = false;
      }
    }
  }

  inputBlur($event) {
    this.onTouched();
  }

  selecttoday(ctrlref) {
    //console.log(ctrlref);
    //console.log(this.datetime);
    //console.log(ctrlref.model);
    this.datetimestore.ToggleClearDate(false);
    this.dp.navigateTo();

    this.datetime = DateTimeModel.fromLocalString(
      new Date(`${moment().format("YYYY/MM/DD HH:mm")}`).toString()
    );
    if (this.datetime.minute > 52) {
      this.datetime.hour = this.datetime.hour + 1;
    }
    this.datetime.minute = (Math.round(this.datetime.minute / 15) * 15) % 60;
    // this.dateString = new Date(
    //   `${moment().format("YYYY-MM-DD HH:mm")}`
    // ).toString();
    //this.dateString = this.datetime.toString();
    this.setDateStringModel();
    this.currentDateShelf = new Date(this.dateString).toString();
  }

  selectreset(ctrlref) {
    //console.log(ctrlref);
    this.datetimestore.ToggleClearDate(true);

    // this.dp.navigateTo();
    //this.datetime = null;
    //this.dateString = null;

    //ctrlref.model.selectedDate = { year: 2020, month: 2, day: 24 };
    this.datetime = DateTimeModel.fromLocalString(
      new Date(`${moment().format("YYYY/MM/DD")} 23:59:56`).toString()
    );
    this.dateString = new Date(
      `${moment().format("YYYY/MM/DD")} 23:59:56`
    ).toString();
    this.setDateStringModel();
    this.currentDateShelf = null;
    return;
  }

  onClick(event) {
    if (!this._eref.nativeElement.contains(event.target)) {
      if (event.target.tagName === "HTML") {
        this.cellEditParams.api.stopEditing();
        this.popover.close();
      } else if (
        !event.target.parentElement.className.includes("ngb") &&
        !event.target.parentElement.className.includes("popover")
      ) {
        this.cellEditParams.api.stopEditing();
        this.popover.close();
      }
    }
  }

  controlSelect = $event => {
    //this can be used to handle the calendar click event
    console.log(`clicked ${JSON.stringify($event)}`);
    if (this.currentDateShelf !== null) {
      //this retain the time value across the date changes when the calendar date is clicked
      this.datetime.hour = parseInt(moment(this.currentDateShelf).format("H"));
      this.datetime.minute = parseInt(
        moment(this.currentDateShelf).format("mm")
      );
      this.datetime.second = parseInt(
        moment(this.currentDateShelf).format("s")
      );
    } else {
      this.datetime.hour = parseInt(moment().format("H"));
      this.datetime.minute = parseInt(moment().format("mm"));
      this.datetime.second = parseInt(moment().format("s"));
    }
    this.dateString = new Date(
      `${moment().format(
        `${$event.year}/${$event.month}/${$event.day}`
      )} ${parseInt(moment().format("h"))}:${parseInt(
        moment().format("mm")
      )}:${parseInt(moment().format("ss"))}`
    ).toString();

    this.onDateChange($event);
  };

  onInputDblClick = $event => {
    console.log("open on dbl click");
    this.popover.open();
  };
}
