import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationModelAddComponent } from './application-model-add.component';

describe('ApplicationModelAddComponent', () => {
  let component: ApplicationModelAddComponent;
  let fixture: ComponentFixture<ApplicationModelAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicationModelAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationModelAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
