import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  changePasswordForm: any = FormGroup;
  responseMessage: any;

  constructor(private formBuilder: FormBuilder, private userService: UserService,
    public dialogRef: MatDialogRef<ChangePasswordComponent>, private ngxService: NgxUiLoaderService, private snackbarService: SnackbarService) { }

  ngOnInit(): void {
    this.changePasswordForm = this.formBuilder.group({
      oldPassword: [null, [Validators.required]],
      newPassword: [null, [Validators.required]],
      confirmPassword: [null, [Validators.required]],
    })
  }

  validateSubmit(){
    if(this.changePasswordForm.controls['newPassword'].value != this.changePasswordForm.controls['confirmPassword'].value){
      return false;
    }else{
      return true;
    }
  }

  handleChangePasswordSubmit(){
    this.ngxService.start();
    var formData = this.changePasswordForm.value;
    this.userService.changePassword(formData).subscribe((response: any)=>{
      this.ngxService.stop();
      this.responseMessage = response?.message;
      this.dialogRef.close();
      this.snackbarService.openSnackBar(this.responseMessage, "success")
    }, (error)=>{
      console.log(error);
      this.ngxService.stop();
      this.responseMessage = error.error?.message ? error.error?.message : GlobalConstants.genericError;
      this.dialogRef.close();
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error)
      
      
    })
  }

}
