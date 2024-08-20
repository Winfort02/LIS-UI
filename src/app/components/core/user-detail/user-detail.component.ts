import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { UserServiceService } from '../../../services/user-service.service';
import { User } from '../../../models/user.model';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CustomResponse } from '../../../models/response.model';
import { MessagesModule } from 'primeng/messages';
import { FIELD_VALIDATIONS } from '../../../helpers/constant.helper';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, ButtonModule, MessagesModule],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss',
  providers: [UserServiceService],
})
export class UserDetailComponent implements OnInit {
  userForm!: FormGroup;
  response: CustomResponse<User> = new CustomResponse(new User(), []);
  isEditMode: boolean = false;

  constructor(
    private builder: FormBuilder,
    private userService: UserServiceService,
    private dialogRef: DynamicDialogRef,
    private dialogConfig: DynamicDialogConfig
  ) {}

  loadUserForm() {
    this.userForm = this.builder.group(
      {
        id: [0],
        name: [
          null,
          [Validators.required, Validators.pattern(FIELD_VALIDATIONS.NAME)],
        ],
        email: [
          null,
          [Validators.required, Validators.pattern(FIELD_VALIDATIONS.EMAIL)],
        ],
        password: [
          null,
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(FIELD_VALIDATIONS.PASSWORD),
          ],
        ],
        confirmPassword: [null, [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  updateUserForm() {
    if (this.dialogConfig?.data) {
      this.isEditMode = true;
      const data = this.dialogConfig?.data;
      this.userForm.setValue({
        id: data.id,
        name: data.name,
        email: data.email,
        password: '',
        confirmPassword: '',
      });
      this.userForm.controls['password'].disable();
      this.userForm.controls['confirmPassword'].disable();
    }
  }

  ngOnInit(): void {
    this.loadUserForm();
    this.updateUserForm();
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

  onCreateUser(data: User) {
    this.userService.createUser(data).subscribe({
      next: (response: any) => {
        this.response = new CustomResponse<User>(response, [
          { severity: 'info', summary: 'New user added successfully' },
        ]);
      },
      error: (errors) => {
        this.response = new CustomResponse<User>(errors, [
          { severity: 'error', summary: errors.error.message },
        ]);
      },
      complete: () => this.dialogRef.close(this.response),
    });
  }

  onUpdateUser(data: User) {
    this.userService.updateUser(data).subscribe({
      next: (response: any) => {
        this.response = new CustomResponse<User>(response, [
          { severity: 'info', summary: 'User updated successfully' },
        ]);
      },
      error: (errors) => {
        this.response = new CustomResponse<User>(errors, [
          { severity: 'error', summary: errors.error.message },
        ]);
      },
      complete: () => this.dialogRef.close(this.response),
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      const user = this.userForm.value as User;
      if (!this.isEditMode) {
        this.onCreateUser(user);
      } else {
        this.onUpdateUser(user);
      }
    }
  }
}
