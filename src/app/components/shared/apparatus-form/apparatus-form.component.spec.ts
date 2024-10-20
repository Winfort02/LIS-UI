import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApparatusFormComponent } from './apparatus-form.component';

describe('ApparatusFormComponent', () => {
  let component: ApparatusFormComponent;
  let fixture: ComponentFixture<ApparatusFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApparatusFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ApparatusFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
