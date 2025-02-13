import { Injectable } from '@angular/core';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class FileExportService {

  constructor() { }

  exportToExcel(data: any[], filename: string): void {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Dates");

    XLSX.writeFile(workbook, `${filename}.xlsx`, { compression: true });
  }

  exportToPDF(columns: any[], data: any[], filename: string): void {
    const doc = new jsPDF();
    
    data = data.map(value =>
      [
        value.fullName,
        value.gender,
        value.idNumber,
        value.address,
        value.city,
        value.birthDate,
        value.phoneNumber
      ]);

    autoTable(doc, {
      head: [columns],
      body: data
    })

    doc.save(`${filename}.pdf`)
  }
}
