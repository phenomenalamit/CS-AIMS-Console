import { Component, OnInit } from '@angular/core';
import { ProjectCrudService } from 'src/app/Service-Application/project-crud.service';

@Component({
  selector: 'app-snip-popup',
  templateUrl: './snip-popup.component.html',
  styleUrls: ['./snip-popup.component.css']
})
export class SnipPopupComponent implements OnInit {
  //tokenForEsnip!:any;
  projectTitleForEsnip!:string;
  rows=[
    {
      "snipId":"1001",
      "projectName":"Project 001 - Health"
    },
    {
      "snipId":"1002",
      "projectName":"Project 002 - Education"
    },
    {
      "snipId":"1003",
      "projectName":"Project 003 - Transport"
    },
    {
      "snipId":"1004",
      "projectName":"Project 004 - Communication"
    },
    {
      "snipId":"1005",
      "projectName":"Project 005 - Culture"
    },
  ];

  datas:any[]=[];

  constructor(private projectCrudService:ProjectCrudService) { }

  ngOnInit(): void {
    this.projectTitleForEsnip=localStorage.getItem("projectTitleForEsnip");
    //this.tokenForEsnip=localStorage.getItem("tokenForEsnip");
    this.searchEsnipListByTitel();
  }

  searchEsnipListByTitel(){
    this.projectCrudService.searchEsnipListByTitel(this.projectTitleForEsnip).subscribe(data=>{
      this.datas=data;
    });
  }

}
