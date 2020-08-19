import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExistingMouPersonalComponent } from './existing-mou-personal.component';

describe('ExistingMouPersonalComponent', () => {
  let component: ExistingMouPersonalComponent;
  let fixture: ComponentFixture<ExistingMouPersonalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExistingMouPersonalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExistingMouPersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
