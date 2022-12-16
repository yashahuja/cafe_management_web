import { Component, EventEmitter, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryService } from 'src/app/services/category.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  onAddCategory = new EventEmitter();
  onEditCategory = new EventEmitter();
  categoryform: any = FormGroup;
  dialogAction: any = 'Add';
  action:any = 'Add';
  responseMessage: any;
  constructor(@Inject(MAT_DIALOG_DATA) public dialogData:any,
  private formBuilder: FormBuilder,
  private categoryService: CategoryService,
  public dialogRef: MatDialogRef<CategoryComponent>,
  private snackbarService: SnackbarService) { }

  ngOnInit(): void {
    this.categoryform = this.formBuilder.group({
      name: [null, [Validators.required]]
    });
    if(this.dialogData.action === 'Edit'){
      this.dialogAction = 'Edit';
      this.action = 'update';
      this.categoryform.patchValue(this.dialogData.data);
    }
  }

  handleSubmit(){
    this.dialogAction === 'Edit' ? this.edit() : this.add();
  }
  add(){
    var formData = this.categoryform.value;
    var data = {
      name: formData.name
    }
    this.categoryService.add(data).subscribe((respose: any)=>{
      this.dialogRef.close();
      this.onAddCategory.emit();
      this.responseMessage = respose.message;
      this.snackbarService.openSnackBar(this.responseMessage, 'success');
    },(error)=>{
      this.dialogRef.close();
      this.responseMessage = error.error?.message ? error.error?.message : GlobalConstants.genericError;
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error); 
    })
  }

  edit(){
    var formData = this.categoryform.value;
    var data = {
      id: this.dialogData.data.id,
      name: formData.name
    }
    this.categoryService.update(data).subscribe((respose: any)=>{
      this.dialogRef.close();
      this.onEditCategory.emit();
      this.responseMessage = respose.message;
      this.snackbarService.openSnackBar(this.responseMessage, 'success');
    },(error)=>{
      this.dialogRef.close();
      this.responseMessage = error.error?.message ? error.error?.message : GlobalConstants.genericError;
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error); 
    })
  }

}
