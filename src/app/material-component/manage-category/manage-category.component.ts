import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CategoryService } from 'src/app/services/category.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { CategoryComponent } from '../dialog/category/category.component';

@Component({
  selector: 'app-manage-category',
  templateUrl: './manage-category.component.html',
  styleUrls: ['./manage-category.component.scss']
})
export class ManageCategoryComponent implements OnInit {

  displayedColumns: string[] = ['name', 'edit'];
  dataSource: any;
  responseMessage: any;
  constructor(private categoryService: CategoryService, private ngxService: NgxUiLoaderService, private dialog: MatDialog,
    private snackbarService: SnackbarService, private router: Router) { }

  ngOnInit(): void {
    this.ngxService.start();
    this.tableData();
  }

  tableData(){
    this.categoryService.getCategory().subscribe((response: any)=>{
      this.ngxService.stop();
      this.dataSource = new MatTableDataSource(response);
    }, (error)=>{
      this.ngxService.stop();
      console.log(error);
      this.snackbarService.openSnackBar(error.error?.message ? error.error?.message : GlobalConstants.genericError, GlobalConstants.error);
    })
  }

  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }

  handleAddAction(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action:'Add'
    }
    dialogConfig.width='850px';
    const dialogRef = this.dialog.open(CategoryComponent, dialogConfig);
    this.router.events.subscribe(()=>{
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onAddCategory.subscribe((Response)=>{
      this.tableData();
    })
  }

  handleEditAction(value: any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action:'Edit',
      data: value
    }
    dialogConfig.width='850px';
    const dialogRef = this.dialog.open(CategoryComponent, dialogConfig);
    this.router.events.subscribe(()=>{
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onEditCategory.subscribe((Response)=>{
      this.tableData();
    })
  }
}
