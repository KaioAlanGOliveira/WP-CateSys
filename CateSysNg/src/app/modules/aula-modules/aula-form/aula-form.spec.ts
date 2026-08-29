import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlunoP } from './aluno-form';

describe('AlunoP', () => {
  let component: AlunoP;
  let fixture: ComponentFixture<AlunoP>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlunoP],
    }).compileComponents();

    fixture = TestBed.createComponent(AlunoP);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
