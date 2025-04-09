import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { utils, writeFile } from "xlsx";

@Injectable({
  providedIn: 'root'
})
export class FileExportService {

  constructor() { }

  /**
   * Export an array of data to an Excel file.
   * 
   * The first row of the array is expected to contain the column headers.
   * 
   * The filename will be used as the sheet name in the spreadsheet, and the
   * file will be saved with an ".xlsx" extension. If the filename is longer
   * than 31 characters, it will be truncated.
   * 
   * @param data The array of data to be exported.
   * @param filename The filename for the exported spreadsheet.
   */
  exportToExcel(data: any[], filename: string): void {
    const sheetName = filename.length > 31 ? filename.substring(0, 31) : filename;
    const worksheet = utils.json_to_sheet(data);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, sheetName);

    writeFile(workbook, `${filename}.xlsx`, { compression: true });
  }

  /**
   * Export an array of demographic data to a PDF file.
   * 
   * The demographic data is expected to be an array of objects, each
   * containing the following properties: fullName, gender, idNumber,
   * address, city, birthDate, and phoneNumber.
   * 
   * The filename will be used as the PDF filename, and the file will be
   * saved with a ".pdf" extension. If the filename is longer than 31
   * characters, it will be truncated.
   * 
   * The columns parameter is an array of strings, each string being a
   * column header for the PDF table.
   * 
   * @param columns An array of column headers.
   * @param data The array of demographic data to be exported.
   * @param filename The filename for the exported PDF.
   */
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

  /**
   * Export an array of credit data to a PDF file.
   * 
   * The credit data is expected to be an array of objects, each
   * containing the following properties: grantorName, idNumber,
   * dueDate, monthlyPayment, lastPaymentDate, and balance.
   * 
   * The filename will be used as the PDF filename, and the file will
   * be saved with a ".pdf" extension. If the filename is longer than
   * 31 characters, it will be truncated.
   * 
   * The columns parameter is an array of strings, each string being a
   * column header for the PDF table.
   * 
   * @param columns An array of column headers.
   * @param data The array of credit data to be exported.
   * @param filename The filename for the exported PDF.
   */

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
