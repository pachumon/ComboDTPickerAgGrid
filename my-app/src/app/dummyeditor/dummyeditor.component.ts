import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  ElementRef
} from "@angular/core";
import {
  ICellRendererAngularComp,
  ICellEditorAngularComp
} from "ag-grid-angular";
import { NgbPopover, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import * as moment from "moment";

@Component({
  selector: "app-dummyeditor",
  templateUrl: "./dummyeditor.component.html",
  styleUrls: ["./dummyeditor.component.scss"],
  host: {
    "(document:mousedown)": "onClick($event)"
  }
})
export class DummyeditorComponent implements OnInit, ICellEditorAngularComp {
  private _datemodel;
  txtmodel: string = "";

  constructor(private _eref: ElementRef) {}

  public get datemodel(): NgbDateStruct {
    return this._datemodel;
  }

  public set datemodel(v: NgbDateStruct) {
    this._datemodel = v;
    this.txtmodel = moment(
      this._datemodel.month +
        "/" +
        this._datemodel.day +
        "/" +
        this._datemodel.year
    ).format("DD/MM/YYYY");
  }

  private params: any;

  @ViewChild(NgbPopover) public popover;

  agInit(params: any): void {
    this.params = params;
    this.datemodel = {
      day: parseInt(moment(params.value,'DD/MM/YYYY').format("DD")),
      month: parseInt(moment(params.value,'DD/MM/YYYY').format("MM")),
      year: parseInt(moment(params.value,'DD/MM/YYYY').format("YYYY"))
    };
  }

  getValue(): any {
    return this.txtmodel;
  }

  ngOnInit() {}
  name = "World";

  onClick(event) {
    if (!this._eref.nativeElement.contains(event.target)) {
      if (event.target.tagName === "HTML") {
        this.params.api.stopEditing();
        this.popover.close();
      } else if (
        !event.target.parentElement.className.includes("ngb") &&
        !event.target.parentElement.className.includes("popover")
      ) {
        this.popover.close();
        this.params.api.stopEditing();
      }
    }
  }

  refresh(): boolean {
    return false;
  }

  onInputDblClick($event) {
    this.popover.open();
  }
}
