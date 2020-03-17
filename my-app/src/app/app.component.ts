import { Component, ViewChild, OnInit } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import { DummyeditorComponent } from "./dummyeditor/dummyeditor.component";
import { DateTimePickerComponent } from "./date-time-picker/date-time-picker.component";
import moment = require("moment");
import { DateTimePickerUnifiedComponent } from "./date-time-picker-unified/date-time-picker-unified.component";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  private defaultColDef;

  @ViewChild("agGrid") agGrid: AgGridAngular;
  title = "app";
  columnDefs;
  rowData;
  gridOptions = {};

  ngOnInit() {
    this.columnDefs = [
      {
        headerName: "SingleViewDTPicker",
        field: "singleViewDateTimePicker",
        sortable: "true",
        cellEditorFramework: DateTimePickerUnifiedComponent,
        valueFormatter: param => {
          if (moment(param.value).isValid()) {
            return moment(param.value).format("MM/DD/YYYY hh:mm A");
          }
          return param.value;
        }
      },
      {
        headerName: "MultiViewDTPicker",
        field: "multiViewDateTimePicker",
        sortable: "true",
        cellEditorFramework: DateTimePickerComponent,
        valueFormatter: param => {
          if (moment(param.value).isValid()) {
            return moment(param.value).format("MM/DD/YYYY hh:mm A");
          }
          return param.value;
        }
      },
      {
        headerName: "SimpleDatePicker",
        field: "simpleDatePicker",
        sortable: "true",
        cellEditorFramework: DummyeditorComponent
      }
    ];

    this.rowData = [
      {
        singleViewDateTimePicker: "02/04/2020",
        multiViewDateTimePicker: "02/04/2020",
        simpleDatePicker: "02/04/2020"
      },
      {
        singleViewDateTimePicker: "",
        multiViewDateTimePicker: "",
        simpleDatePicker: "03/04/2020"
      },
      {
        singleViewDateTimePicker: "04/05/2020",
        multiViewDateTimePicker: "04/05/2020",
        simpleDatePicker: "04/05/2020"
      }
    ];

    this.defaultColDef = {
      editable: true,
      resizable: true,
      filter: true
    };

    this.gridOptions = {
      columnDefs: this.columnDefs,
      rowData: this.rowData,
      onGridReady: this.onGridReady,
      defaultColDef: this.defaultColDef
    };
  }

  onGridReady(params) {
    params.api.sizeColumnsToFit();
  }
}
