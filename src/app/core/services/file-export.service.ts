import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { utils, writeFile } from "xlsx";

@Injectable({
  providedIn: 'root'
})
export class FileExportService {

  constructor() { }

  exportToExcel(data: any[], filename: string): void {
    const worksheet = utils.json_to_sheet(data);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Dates");

    writeFile(workbook, `${filename}.xlsx`, { compression: true });
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

  exportCreditToPDF(columns: any[], data: any[], filename: string): void {
    const doc = new jsPDF();
    
    data = data.map(value =>
      [
        value.grantorName,
        value.idNumber,
        value.dueDate,
        value.monthlyPayment,
        value.lastPaymentDate,
        value.balance,
      ]);

    autoTable(doc, {
      head: [columns],
      body: data
    })

    doc.save(`${filename}.pdf`)
  }
}
