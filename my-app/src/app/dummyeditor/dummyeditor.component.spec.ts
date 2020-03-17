import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DummyeditorComponent } from './dummyeditor.component';

describe('DummyeditorComponent', () => {
  let component: DummyeditorComponent;
  let fixture: ComponentFixture<DummyeditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DummyeditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DummyeditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
