import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApparatusComponent } from './apparatus.component';

describe('ProductComponent', () => {
  let component: ApparatusComponent;
  let fixture: ComponentFixture<ApparatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApparatusComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ApparatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
