import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FolderStructureServiceClass } from 'src/app/Service-Class/folder-structure-service-class';
import { FolderStructureService } from 'src/app/Service/folder-structure-service';
import Swal from 'sweetalert2';
import { UserAccessPermission } from '../../UI-components/loginscreen/loginscreen.component';

@Component({
  selector: 'app-view-folder-structure-adminstration',
  templateUrl: './view-folder-structure-adminstration.component.html',
  styleUrls: ['./view-folder-structure-adminstration.component.css']
})
export class ViewFolderStructureAdminstrationComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  totalRows:number=0;
  //foldertStrData = new MatTableDataSource<EnvelopeServiceClass>(envelopeDetails);
  foldertStrDataSource = new MatTableDataSource<FolderStructureServiceClass>(folderStrDetails);
  usergroup: any;
  browserLang: any;
  constructor(private folderStrService:FolderStructureService, private router: Router) { 
    this.browserLang = localStorage.getItem("browserLang");
  }
  displayedColumns: string[] = ['edit', 'moduleName','folderName'];
  uAccessPermArr:UserAccessPermission[]=[];
  userPermission:number[]=[];
  authorised_flag=false;
  ngOnInit(): void {
    this.uAccessPermArr=JSON.parse(localStorage.getItem("uAccessPermArr"));
    /* Here we can get which usergroup is login */
    this.usergroup = localStorage.getItem('usergroup');
    this.setToAuthFlag();
    this.setToUserPermission();
    
    /* purpose of call this method is to fetch all folder structure data */
    this.fetchFolderStrData();
  }
/* If we type something for filter then here the data will filter */
applyFilter(filterValue: string) {
  this.foldertStrDataSource.filter = filterValue.trim().toLowerCase();
  this.totalRows=this.foldertStrDataSource.filteredData.length;
  }
   /* Here we can fetch all folder structure data by calling servie */
   private fetchFolderStrData() {
    this.folderStrService.getFolderStr().subscribe(data => {
      folderStrDetails = data;
      this.totalRows = folderStrDetails.length;

      /* Add data in MatTableDataSource */
      this.foldertStrDataSource = new MatTableDataSource<FolderStructureServiceClass>(folderStrDetails);

      /* Set Paginator */
      setTimeout(() =>
        this.foldertStrDataSource.paginator = this.paginator
      );
      /* Set sorting */
      setTimeout(() =>
        this.foldertStrDataSource.sort = this.sort
      );
    });
  }

  /* This is for go to edit page */
  goToEdit(editId: any) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/admin/edit-folder-structure-administartion', editId]));
  }

  //Sourav Kumar Nayak
  setToUserPermission(){
    for(let i=0;i<this.uAccessPermArr.length;i++){
      if(this.uAccessPermArr[i].primaryLinkName=='View Folder Structure')
        this.userPermission=this.uAccessPermArr[i].permissionArr;
    }
  }

  //Sourav Kumar Nayak
  setToAuthFlag(){
    for(let i=0;i<this.uAccessPermArr.length;i++){
      if(this.uAccessPermArr[i].primaryLinkName=='View Folder Structure'){
        this.authorised_flag=true;
      }
    }
  }

  goToViewMore(viewId:any){
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/admin/view-folder-structure-administartion', viewId]));
  }
  getValueByLang(){
    this.browserLang = localStorage.getItem("browserLang");
  }
  /* If we click on delete button then it gives an alert */
  delete(folderStrId: any) {
    this.getValueByLang();
    Swal.fire({
      /* Whenever we click on delete button then it will give two more button i.e. delete and cancel */
      title: (this.browserLang=='en')? 'Do you want to delete?':'Deseja Apagar?',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText:(this.browserLang=='en')? `Delete`:'Apagar',
      denyButtonText: (this.browserLang=='en')?`Cancel`:'Cancelar',
    }).then((result) => {
      
      /* If we click on delete button then by given id that record will deleted*/
      if (result.isConfirmed) {
        /* Here we call service to delete data from db by given id */
        this.folderStrService.deleteFolderStr(folderStrId).subscribe(data => {
          if(this.browserLang=='en'){
            Swal.fire('Deleted successfully', '', 'success')
          }else{
            Swal.fire('Apagado com sucesso', '', 'success')
          }
          this.fetchFolderStrData();
          
        })
        

      }
      /* If we click on Cancel button then no record will be deleted */
      else if (result.isDenied) {
        if(this.browserLang=='en')
        Swal.fire('Cancelled', '', 'info');
        else{
          Swal.fire('Cancelado', '', 'info');
        }
      }
    })
  }

  
}
let folderStrDetails: FolderStructureServiceClass[] = [];
