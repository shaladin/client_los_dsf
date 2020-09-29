import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyMainDataComponent } from './family-main-data.component';

describe('FamilyMainDataComponent', () => {
  let component: FamilyMainDataComponent;
  let fixture: ComponentFixture<FamilyMainDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FamilyMainDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyMainDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
