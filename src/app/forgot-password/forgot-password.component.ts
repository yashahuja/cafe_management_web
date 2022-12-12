import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../services/snackbar.service';
import { UserService } from '../services/user.service';
import { GlobalConstants } from '../shared/global-constants';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  forgotPasswordForm: any = FormGroup;
  responseMessage: any;

  constructor(private formBuilder: FormBuilder, private router: Router, private userService: UserService, private snackbar: SnackbarService,
    private dialogRef: MatDialogRef<ForgotPasswordComponent>, private ngxService: NgxUiLoaderService
    ) { }

  ngOnInit(): void {
    this.forgotPasswordForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]],
    })
  }

  public handleSubmit(){
    this.ngxService.start();
    var formData = this.forgotPasswordForm.value;
    var data = {
      email: formData.email
    }

    this.userService.forgotPassword(data).subscribe((response: any)=>{
      this.ngxService.stop();
      this.dialogRef.close();
      this.responseMessage = response?.message;
      this.snackbar.openSnackBar(this.responseMessage, '');
    }, (err)=>{
      this.ngxService.stop();
      if(err.error?.message){
        this.responseMessage = err.error?.message;
      }else{
        this.responseMessage = GlobalConstants.genericError
      }
      this.snackbar.openSnackBar(this.responseMessage, GlobalConstants.error);
    })

  }
}
