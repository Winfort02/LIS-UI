import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FIELD_VALIDATIONS } from '../../../helpers/constant.helper';
import { UserServiceService } from '../../../services/user-service.service';
import { User } from '../../../models/user.model';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [InputTextModule, ButtonModule, ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss',
  providers: [UserServiceService],
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm!: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserServiceService,
    private dialogRef: DynamicDialogRef
  ) {}
  ngOnInit(): void {
    this.changePasswordForm = this.formBuilder.group(
      {
        password: new FormControl('', [
          Validators.required,
          Validators.pattern(FIELD_VALIDATIONS.PASSWORD),
        ]),
        confirmPassword: new FormControl('', [
          Validators.required,
          Validators.pattern(FIELD_VALIDATIONS.PASSWORD),
        ]),
      },
      { validators: this.passwordMatchValidator }
    );
  }

  // Custom validator to check if passwords match
  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('password');
    const confirmPassword = group.get('confirmPassword');
    if (password?.value !== confirmPassword?.value) {
      confirmPassword?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    confirmPassword?.setErrors(null);
    return null;
  }

  onSave() {
    if (!this.changePasswordForm.valid) return;
    this.userService
      .changePassword(this.changePasswordForm.value as User)
      .subscribe({
        next: (response) => {
          this.dialogRef.close({ success: true });
        },
        error: (err) => {
          throw new Error(err);
        },
      });
  }
}
