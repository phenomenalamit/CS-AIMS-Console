import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-adminmaster',
  templateUrl: './adminmaster.component.html',
  styleUrls: ['./adminmaster.component.css']
})
export class AdminmasterComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    $(function(){

      // Toggle the side navigation
         $("#sidebarToggle, #sidebarToggleTop").on('click', function(e) {
             $("body").toggleClass("sidebar-toggled");
             $(".leftmenu").toggleClass("toggled");
             if ($(".leftmenu").hasClass("toggled")) {
                //  $('.sidebar .collapse').collapse('hide');
             };
             //$("#sidebarToggle i").toggleClass("fa-outdent fa-indent");
         });

          // Close any open menu accordions when window is resized below 768px
        //  $(window).resize(function() {
            if ($(window).width() < 768) {
              $(".leftmenu").toggleClass("toggled");
            };
        //  });

      });

    //  $('[data-toggle="tooltip"]').tooltip(); 

  }

  

}
