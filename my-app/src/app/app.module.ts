import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AgGridModule } from "ag-grid-angular";

import { AppComponent } from "./app.component";
import { DummyeditorComponent } from "./dummyeditor/dummyeditor.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DateTimePickerComponent } from "./date-time-picker/date-time-picker.component";
import { DateTimePipe } from "./date-time-picker/datetime-pipe";

import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { library as fontLibrary } from "@fortawesome/fontawesome-svg-core";
import { faCalendar, faClock } from "@fortawesome/free-solid-svg-icons";
import { DateTimePickerUnifiedComponent } from "./date-time-picker-unified/date-time-picker-unified.component";
fontLibrary.add(faCalendar, faClock);

@NgModule({
  declarations: [AppComponent, DummyeditorComponent, DateTimePickerComponent,DateTimePipe,DateTimePickerUnifiedComponent],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AgGridModule.withComponents([
      DummyeditorComponent,
      DateTimePickerComponent,
      DateTimePickerUnifiedComponent
    ]),
    NgbModule.forRoot(),
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
