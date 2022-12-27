var host = window.location.host;
var pathInfo = window.location.pathname;
var FN1 = pathInfo.split('/')[1];
var FN2 = pathInfo.split('/')[2];
if(FN1 != ''){
    var appURL = "http://" + host + "/" + FN1;
}else{
    var appURL = "http://" + host;
}

var printMe
var backMe
var deleteMe
var downloadMe
var indicateMe
var excelMe
var pdfMe

// util function
function goBack() {
	window.history.back();
}

    $("#printIcon").hide();
    $("#backIcon").hide();
    $("#deleteIcon").hide();
    $("#indicate").hide();
	$("#downloadIcon").hide();
	$("#excelIcon").hide();
	$("#pdfIcon").hide();

    function checkStatus() {		
        if (backMe == "yes")
        {
            $('#backIcon').show();
            $("#backIcon").tooltip();
        }
        if (printMe == "yes")
        {
            $('#printIcon').show();
            $("#printIcon").tooltip();
        }
        if (deleteMe == "yes")
        {
            $('#deleteIcon').show();
            $("#deleteIcon").tooltip();
        }
        
        if (indicateMe == "yes")
        {
            $('#indicate').show();
            $("#indicate").tooltip();
        }

        if(downloadMe=="yes")
		{
			$('#downloadIcon').show();
			$("#downloadIcon").tooltip();
		}
		if(excelMe=="yes")
		{
			$('#excelIcon').show();
			$("#excelIcon").tooltip();
		}
		if(pdfMe=="yes")
		{
			$('#pdfIcon').show();
			$("#pdfIcon").tooltip();
		}

    }
$(document).ready(function(){
	checkStatus();
	
	$('.form-container')
	var winHeight = $(window).height();
	if ( $('.form-container').height() < winHeight ){
		$('.form-container').css({"min-height": winHeight - 230})
	}
	
	$('.searchform').hide();
	$('.searchbtn').click(function(){
		$('.searchform').slideToggle();
		$('.searchbtn .fas').toggleClass('fa-chevron-down fa-chevron-up');
		if ($('.searchbtn span').text() == "Hide")
		   $('.searchbtn span').text("Search")
		else
		   $('.searchbtn span').text("Hide");		
	});
});




function loadNavigation(pgName,gLink,pLink,fLink,lLink,title) {
	var totLink = '';
    var pathName = window.location.pathname;	
    var fileName = pathName.split('/').reverse()[0].split('.').reverse()[1];
    if (pgName == fileName)
        if (pLink != '') {			
            $('.' + gLink).addClass('active').find('.collapse').addClass('show');
        } else {
            $('.' + gLink).addClass('active').find('.collapse').addClass('show');
        }
        $('.' + pLink).addClass('active');
		if(lLink!='')
			totLink="<li class='breadcrumb-item'>" +  fLink + " </li><li class='breadcrumb-item font-weight-bold'>" + lLink + "</li>";
		else
			totLink=" <li class='breadcrumb-item active'> " +  fLink + "</li>";
		$('#navigation').html('<li class="breadcrumb-item"><a href="../DASHBOARD/Dashboard.aspx" title="Home" ><i class="fa fa-home"></i></a></li>' + totLink);
		$('#title').append(title);
		printHeader=title;
		
}
// print function
function PrintPage() {
    var windowName = "PrintPage";
    var wOption = "width=1000,height=600,menubar=yes,scrollbars=yes,location=no,left=100,top=100";
    var cloneTable = $("#viewtable").clone();
    var head = $('#viewtable thead tr');

    cloneTable.find('input[type=text],select,textarea').each(function () {
        var elementType = $(this).prop('tagName');
        if (elementType == 'SELECT')
        {

            if ($(this).val() > 0)
                var textVal = $(this).find("option:selected").text();
            else
                textVal = '';
        }
        else
            var textVal = $(this).val();
        $(this).replaceWith('<label>' + textVal + '</label>');
    });
    cloneTable.find('a').each(function () {
        var anchorVal = $(this).html();
        $(this).replaceWith('<label>' + anchorVal + '</label>');
    });

    var pageTitle = $("#title").text();
    var wWinPrint = window.open("", windowName, wOption);
    wWinPrint.document.write("<html><head><script type='text/javascript' src='../js/jquery.min.js'></script><link href='../css/bootstrap.min.css' rel='stylesheet'><link href='../css/print.css' rel='stylesheet'><title>NATIONAL SOIL INFORMATION SYSTEM (NSIS)</title></head><body>");
    wWinPrint.document.write("<div id='header'><h4 style='margin-bottom:0;'><img src='../img/govt.png' alt='PDIS' height='50'>  <a href='javascript:void(0)' class='btn btn-success btn-sm float-right' title='Print' onclick='$(this).hide();window.print();$(this).show();'>Print</a></h4> </div><hr>")
    //wWinPrint.document.write("<div id='printHeader'>" + pageTitle + "</div>");
    wWinPrint.document.write("<div id='printContent'>" + cloneTable.html() + "</div>");
   // wWinPrint.document.write("<div id='printFooter' class='text-center'>&copy; 2019 - GO SKILL</div>");
    wWinPrint.document.write("</body></html>");
    wWinPrint.document.close();
    wWinPrint.focus();
    return wWinPrint;
}


// function
(function($) {
  "use strict"; // Start of use strict

 // Toggle the side navigation
    $("#sidebarToggle, #sidebarToggleTop").on('click', function(e) {
        $("body").toggleClass("sidebar-toggled");
        $(".sidebar").toggleClass("toggled");
        if ($(".sidebar").hasClass("toggled")) {
            $('.sidebar .collapse').collapse('hide');
        };
        //$("#sidebarToggle i").toggleClass("fa-outdent fa-indent");
    });

  // Close any open menu accordions when window is resized below 768px
  $(window).resize(function() {
    if ($(window).width() < 768) {
      $('.sidebar .collapse').collapse('hide');
    };
  });

  // Prevent the content wrapper from scrolling when the fixed side navigation hovered over
  $('body.fixed-nav .sidebar').on('mousewheel DOMMouseScroll wheel', function(e) {
    if ($(window).width() > 768) {
      var e0 = e.originalEvent,
        delta = e0.wheelDelta || -e0.detail;
      this.scrollTop += (delta < 0 ? 1 : -1) * 30;
      e.preventDefault();
    }
  });

  // Scroll to top button appear
  $(document).on('scroll', function() {
    var scrollDistance = $(this).scrollTop();
    if (scrollDistance > 100) {
      $('.scroll-to-top').fadeIn();
    } else {
      $('.scroll-to-top').fadeOut();
    }
  });


    $(function () {
        $(".service-panel-toggle").on("click", function () {
            $(".customizer").toggleClass("show-service-panel");
        }),
            $(".pagetop").on("click", function () {
                $(".customizer").removeClass("show-service-panel");
            });
    }),



  // Smooth scrolling using jQuery easing
  $(document).on('click', 'a.scroll-to-top', function(e) {
    var $anchor = $(this);
    $('html, body').stop().animate({
      scrollTop: ($($anchor.attr('href')).offset().top)
    }, 1000, 'easeInOutExpo');
    e.preventDefault();
  });

    // $('[data-toggle="tooltip"]').tooltip();

})(jQuery); // End of use strict



// Theme


var lstorageThemeval = localStorage.getItem("webtheme");
var lstorageSideThemeval = localStorage.getItem("sidetheme");

// alert(lstorageThemeval);
if (lstorageThemeval !== "") {

    $('.theme-seeting ul li a').removeClass('active');
    $('head').append('<link id="' + lstorageThemeval + 'css"  href="../assets/css/' + lstorageThemeval + '.css" rel="stylesheet"  />');
    $('#' + lstorageThemeval).addClass('active');
}

if (lstorageThemeval == null) {
    localStorage.removeItem('webtheme');
}


$('.theme-seeting ul li a').on('click', function () {
    $('.theme-seeting ul li a').removeClass('active');
    $(this).addClass('active');

    $('head').find("#" + lstorageThemeval + 'css').remove();
    var themeid = $(this).attr("id");
    //alert(themeid);

    if (typeof (Storage) !== "undefined") {

        localStorage.setItem("webtheme", themeid);
        var lstorageThemeval = localStorage.getItem("webtheme");
        //alert(lstorageThemeval);
        $('head').append('<link id="' + lstorageThemeval + 'css"  href="../assets/css/' + lstorageThemeval + '.css" rel="stylesheet"  />');
    }
});




if (lstorageSideThemeval == null) {
    localStorage.removeItem('sidetheme');
}



if (lstorageSideThemeval !== "") {

    $('.SideNavBG ul li a').removeClass('active');
    $('head').append('<link id="' + lstorageSideThemeval + 'css"  href="../assets/css/' + lstorageSideThemeval + '.css" rel="stylesheet"  />');
    $('#' + lstorageSideThemeval).addClass('active');
}


$('.SideNavBG ul li a').on('click', function () {
    $('.SideNavBG ul li a').removeClass('active');
    $(this).addClass('active');

    $('head').find("#" + lstorageSideThemeval + 'css').remove();
    var themeid = $(this).attr("id");
    //alert(themeid);

    if (typeof (Storage) !== "undefined") {

        localStorage.setItem("sidetheme", themeid);
        var lstorageSideThemeval = localStorage.getItem("sidetheme");
        //alert(lstorageThemeval);
        $('head').append('<link id="' + lstorageSideThemeval + 'css"  href="../assets/css/' + lstorageSideThemeval + '.css" rel="stylesheet"  />');
    }
});


$('#style').on('click', function () {
    localStorage.removeItem('webtheme');
    // alert(lstorageThemeval);
    $('head').find("#" + lstorageThemeval + 'css').remove();
})


