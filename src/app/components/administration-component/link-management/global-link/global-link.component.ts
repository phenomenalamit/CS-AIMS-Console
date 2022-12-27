import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-global-link',
  templateUrl: './global-link.component.html',
  styleUrls: ['./global-link.component.css']
})
export class GlobalLinkComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  num: any;
  funds:any;
  tabClick(index: number) {
    this.num = index;
  }
}
