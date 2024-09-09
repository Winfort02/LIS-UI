import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HematologyFormComponent } from './hematology-form.component';

describe('HematologyFormComponent', () => {
  let component: HematologyFormComponent;
  let fixture: ComponentFixture<HematologyFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HematologyFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HematologyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
