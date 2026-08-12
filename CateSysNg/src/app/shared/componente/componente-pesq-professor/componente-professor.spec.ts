import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponenteProfessor } from './componente-professor';

describe('ComponenteProfessor', () => {
  let component: ComponenteProfessor;
  let fixture: ComponentFixture<ComponenteProfessor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponenteProfessor],
    }).compileComponents();

    fixture = TestBed.createComponent(ComponenteProfessor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
