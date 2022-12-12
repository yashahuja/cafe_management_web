import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AnyMxRecord } from 'dns';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../services/snackbar.service';
import { UserService } from '../services/user.service';
import { GlobalConstants } from '../shared/global-constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: any;
  responseMessage: any;

  constructor(private formBuilder: FormBuilder, private router: Router, private userService: UserService, private snackbar: SnackbarService,
    private dialogRef: MatDialogRef<LoginComponent>, private ngxService: NgxUiLoaderService
    ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]],
      password: [null, [Validators.required]],
    })
  }

  public handleSubmit(){
    this.ngxService.start();
    var formData = this.loginForm.value;
    var data = {
      email: formData.email,
      password: formData.password
    }

    this.userService.login(data).subscribe((response: any)=>{
      this.ngxService.stop();
      this.dialogRef.close();
      localStorage.setItem('token', response.token);
      // this.responseMessage = response?.message;
      // this.snackbar.openSnackBar(this.responseMessage, '');
      this.router.navigate(['/cafe/dashboard']);
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
