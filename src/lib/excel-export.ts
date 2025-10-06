import ExcelJS from "exceljs";

export interface ExcelColumn {
  header: string;
  key: string;
  width?: number;
}

export interface ExcelExportOptions {
  sheetName: string;
  columns: ExcelColumn[];
  data: Record<string, unknown>[];
}

export async function createExcelExport({
  sheetName,
  columns,
  data,
}: ExcelExportOptions): Promise<ArrayBuffer> {
  // Create workbook and worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName);

  // Set columns
  worksheet.columns = columns;

  // Add data rows
  data.forEach((row) => {
    worksheet.addRow(row);
  });

  // Style the header row
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFE0E0E0" },
  };

  // Auto-fit columns
  worksheet.columns.forEach((column) => {
    if (column.eachCell) {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const columnLength = cell.value ? cell.value.toString().length : 10;
        if (columnLength > maxLength) {
          maxLength = columnLength;
        }
      });
      column.width = maxLength < 10 ? 10 : maxLength + 2;
    }
  });

  // Generate Excel buffer
  return await workbook.xlsx.writeBuffer();
}

export function createExcelResponse(
  buffer: ArrayBuffer,
  filename: string
): Response {
  const response = new Response(buffer);
  response.headers.set(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  response.headers.set(
    "Content-Disposition",
    `attachment; filename="${filename}"`
  );
  return response;
}
