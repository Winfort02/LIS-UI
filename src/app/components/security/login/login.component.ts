import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { UserServiceService } from '../../../services/user-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [InputTextModule, ReactiveFormsModule, ButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [UserServiceService],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  incorrectInfo: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserServiceService,
    private router: Router
  ) {}

  onSubmit() {
    if (this.loginForm.valid) {
      this.userService.login(this.loginForm.value).subscribe({
        next: () => {
          this.incorrectInfo = false;
        },
        error: () => {
          this.incorrectInfo = true;
        },
        complete: () => {
          this.router.navigate(['/application']);
        },
      });
    }
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  }
}
