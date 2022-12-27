import { ElementRef, Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import * as XLSX from 'xlsx';
import * as fs from 'file-saver';
import { DatePipe } from '@angular/common';




const EXCEL_EXTENSION = '.xlsx';
const getFileName = (name: string) => {
  let timeSpan = new Date().toISOString();
  let sheetName = "AIMS-"+name || "ExportResult";
  let fileName = `${sheetName}-${timeSpan}`;
  return {
    sheetName,
    fileName
  };
};

@Injectable({
  providedIn: 'root'
})

export class ExcelService {

  constructor(public datepipe: DatePipe) { }

/**
   * Creates excel from the table element reference.
   *
   * @param element DOM table element reference.
   * @param fileName filename to save as.
   */
 public exportTableElmToExcel(tableId: string, name: string) {
  var header =[];
  var tableData = [];
  
  let { sheetName, fileName } = getFileName(name);

  let workbook = new Workbook();
   
  //let targetTableElm = document.getElementById(tableId);
  // let wb = XLSX.utils.table_to_book(targetTableElm, <XLSX.Table2SheetOpts>{
  //   sheet: sheetName
  // });
  // XLSX.writeFile(wb, `${fileName}.xlsx`);

  const title = name+' Report';
  let ws1: XLSX.WorkSheet;
  console.log("element : ",document.getElementById(tableId))
  //ws1 = XLSX.utils.table_to_sheet(tableId.nativeElement);
  ws1=XLSX.utils.table_to_sheet(document.getElementById(tableId));
  // if(name==='Envelope'){
  //  ws1 = XLSX.utils.table_to_sheet(tableId);
  // }
  // else{
  //   ws1=XLSX.utils.table_to_sheet(document.getElementById(tableId));
  // }
  
  const ws:XLSX.WorkSheet = ws1;
  //delete (ws['O1'])
  // ws['!cols'] = [];
  // ws['!cols'][0] = { hidden: true };
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  
  let worksheet = workbook.addWorksheet(name+' Report');

  var projectTitle = "Aid Information Management System";
  let projectTitleXl = worksheet.addRow([projectTitle]);
  let title1 = worksheet.addRow([title]);
  projectTitleXl.font = { name: 'Calibri', family: 4, size: 16, underline: 'double', bold: true }
  title1.font = { name: 'Calibri', family: 4, size: 12, underline: 'double', bold: true }
  worksheet.addRow([]);

 


// console.log("sheet to json : ",XLSX.utils.sheet_to_json(ws, { header: 1}))
  // getting all rows
 const data = (XLSX.utils.sheet_to_json(ws, { header: 1})); 

console.log("data",data)
var slno=1;

 //const data1 = XLSX.utils.sheet_add_json(ws, data, {skipHeader: true});
//  console.log("Excel data:",data);
 
 let subTitleRow = worksheet.addRow(['Date : ' +  this.datepipe.transform(new Date(), 'dd/MMM/yyyy')]);
 worksheet.addRow([]);
 //console.log("data1:"+data1);
// Fetch the first row



let header1 = data.shift();
data.forEach(element => {
  (element as Array<any>)[0]=slno++;
});
for(let i=0;i<=10;i++){
 tableData.push(data.shift());
}
// console.log("data : ",data)
delete header1[0];
header1[0]="Serial No.";
// console.log("header:",header1);
// debugger
 //Add Header Row
 let headerRow = worksheet.addRow(header1);
    
 // Cell Style : Fill and Border
 headerRow.eachCell((cell, number) => {
  cell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFFFFF00' },
    bgColor: { argb: 'FF0000FF' },
  }
  cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
  cell.font = {bold:true}
})

// debugger
// Add Data and Conditional Formatting
// console.log(tableData)
tableData.forEach(d => {
  // console.log("d value : ",d)
  let row = worksheet.addRow(d);
}
);
var range = XLSX.utils.decode_range(ws['!ref']);
// console.log("range:",range);
for(var C = range.s.r; C <= range.e.r; ++C) {
  var address = XLSX.utils.encode_col(C) + "1"; // <-- first row, column number C
  if(!ws[address]) continue;
  ws[address].v = ws[address].v.toUpperCase();

}
  //const row = ws[0];
  //header = { name: 'Verdana', size: 16, underline: 'single', bold: true };
  
  ws['!cols'] = [];
  // ws.autoFitColumn(3);
  if(name ==='Envelope' || name === 'Project' || name==='Funding' 
  || name==='Disbursment' || name==='Payment' || name==='Organization' 
  || name==='Individual' || name==='User Account'){
    ws['!cols'][0] = { hidden: true };
    
  }

  worksheet.columns.forEach(function (column, i) {
    if(i!==0)
    {
    var maxLength = 0;
    column["eachCell"]({ includeEmpty: true }, function (cell) {
        var columnLength = cell.value ? cell.value.toString().length : 10;
        if (columnLength > maxLength ) {
            maxLength = columnLength;
        }
    });
    column.width = maxLength < 10 ? 10 : maxLength;
  }
  });
 
// ws.autoFitColumns();
  
  // header.font((cell, number) => {
  //   cell.fill = {
  //     type: 'pattern',
  //     pattern: 'solid',
  //     fgColor: { argb: 'FFFFFF00' },
  //     bgColor: { argb: 'FF0000FF' }
  //   }
  //   cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
  // })

  //bold = wb.add_format({'bold': True})
  
//   ws.AllocatedRange.AutoFitColumns();
// ws.AllocatedRange.AutoFitRows();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  /* save file */


  workbook.xlsx.writeBuffer().then((data) => {
    let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    fs.saveAs(blob, `${fileName}.xlsx`);
  })
  //XLSX.writeFile(wb, `${fileName}.xlsx`);
  
}

}
