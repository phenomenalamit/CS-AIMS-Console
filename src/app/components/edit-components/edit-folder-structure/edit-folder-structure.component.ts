import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-edit-folder-structure',
  templateUrl: './edit-folder-structure.component.html',
  styleUrls: ['./edit-folder-structure.component.css']
})
export class EditFolderStructureComponent implements OnInit {

  constructor(private readonly route: ActivatedRoute,private location:Location) { }
  num:any;
  editId:any=null;
    viewId:any=null;
  tabClick(index: number) {
    this.num=index;
  }
  usergroup:any;
  ngOnInit(): void {
    this.usergroup=localStorage.getItem('usergroup');
    this.viewId=this.route.snapshot.paramMap.get("viewId");
    this.editId=this.route.snapshot.paramMap.get("editId");
  }
  moveToPreviousTab(){
    this.location.back();
  }
}
