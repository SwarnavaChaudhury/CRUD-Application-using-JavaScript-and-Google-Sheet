const sheetName = 'customer_database';
const scriptProp = PropertiesService.getScriptProperties();

const initialSetup = () => {
  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  scriptProp.setProperty('key', activeSpreadsheet.getId());
}

// handle GET
// const doGet = (e) => {

//   const lock = LockService.getScriptLock();
//   lock.tryLock(10000);

//   try {

//     // setting up the sheet
//     const doc = SpreadsheetApp.openById(scriptProp.getProperty('key'));
//     const sheet = doc.getSheetByName(sheetName);

//     // getting the header (column name) from the GET Request
//     const { header } = e.parameter;
//     console.log(header);

//     // getting the headers ( column names ) from the sheet
//     const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

//     // finding the correct column based on the header (column name).
//     const column = headers.indexOf(header) + 1; // adding 1 because index is 0-based, and sheet is 1-based

//     // getting the values form the desired column
//     const dataRaw = sheet.getRange(2, column, sheet.getLastRow() - 1, 1).getValues().map(item => item[0]);

//     const data = Array.from(new Set(dataRaw));

//     // returning
//     return ContentService
//       .createTextOutput(JSON.stringify({ 'result': 'success', data }))
//       .setMimeType(ContentService.MimeType.JSON);


//   } catch (error) {

//     return ContentService
//       .createTextOutput(JSON.stringify({ 'result': 'error', error }))
//       .setMimeType(ContentService.MimeType.JSON);

//   } finally {

//     lock.releaseLock();

//   }
// }



// handle GET for all data
const doGet = (e) => {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    const doc = SpreadsheetApp.openById(scriptProp.getProperty('key'));
    const sheet = doc.getSheetByName(sheetName);
    const rows = sheet.getDataRange().getValues(); // all data

    const data = rows.slice(1).map(row => {
      return {
        Customer: row[0],
        Phone: row[1],
        Address: row[2],
        Price: row[3],
        Date: row[4]
      };
    });

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success', data }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', error }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}










// // handle POST
// const doPost = (e) => {

//   const lock = LockService.getScriptLock();
//   lock.tryLock(10000);

//   try {

//     // setting up the sheet
//     const doc = SpreadsheetApp.openById(scriptProp.getProperty('key'));
//     const sheet = doc.getSheetByName(sheetName);

//     // getting the headers (column names) from the sheet
//     const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

//     // creating a new row of values from the POST body.
//     const newRow = headers.map((header) => {
//       return header === 'Date' ? new Date() : e.parameter[header];
//     })

//     // inserting the new row.
//     const nextRow = sheet.getLastRow() + 1;
//     sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow]);

//     // returning
//     return ContentService
//       .createTextOutput(JSON.stringify({ 'result': 'success', 'row': nextRow }))
//       .setMimeType(ContentService.MimeType.JSON);

//   } catch (error) {

//     return ContentService
//       .createTextOutput(JSON.stringify({ 'result': 'error', error }))
//       .setMimeType(ContentService.MimeType.JSON);

//   } finally {

//     lock.releaseLock();

//   }

// }





function deleteRow(row) {
  const doc = SpreadsheetApp.openById(scriptProp.getProperty('key'));
  const sheet = doc.getSheetByName(sheetName);

  // Delete the specified row
  sheet.deleteRow(row);
}




// function doPost(e) {
//   const lock = LockService.getScriptLock();
//   lock.tryLock(10000);

//   try {
//     const action = e.parameter.action;

//     if (action === "delete") {
//       const row = parseInt(e.parameter.row, 10);
//       deleteRow(row);

//       return ContentService
//         .createTextOutput(JSON.stringify({ result: "success", message: `Row ${row} deleted.` }))
//         .setMimeType(ContentService.MimeType.JSON);
//     }

//     // Your existing insertion logic...
//     const doc = SpreadsheetApp.openById(scriptProp.getProperty('key'));
//     const sheet = doc.getSheetByName(sheetName);
//     const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

//     const newRow = headers.map((header) => {
//       return header === 'Date' ? new Date() : e.parameter[header];
//     });

//     const nextRow = sheet.getLastRow() + 1;
//     sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow]);

//     return ContentService
//       .createTextOutput(JSON.stringify({ 'result': 'success', 'row': nextRow }))
//       .setMimeType(ContentService.MimeType.JSON);

//   } catch (error) {
//     return ContentService
//       .createTextOutput(JSON.stringify({ 'result': 'error', 'error': error.message }))
//       .setMimeType(ContentService.MimeType.JSON);
//   } finally {
//     lock.releaseLock();
//   }
// }



function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const action = e.parameter.action;

    const doc = SpreadsheetApp.openById(scriptProp.getProperty('key'));
    const sheet = doc.getSheetByName(sheetName);
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

    if (action === "delete") {
      const row = parseInt(e.parameter.row, 10);
      sheet.deleteRow(row);
      return ContentService
        .createTextOutput(JSON.stringify({ result: "success", message: `Row ${row} deleted.` }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (action === "update") {
      const row = parseInt(e.parameter.row, 10);
      const updatedRow = headers.map(header =>
        header === 'Date' ? new Date() : e.parameter[header]
      );
      sheet.getRange(row, 1, 1, updatedRow.length).setValues([updatedRow]);
      return ContentService
        .createTextOutput(JSON.stringify({ result: "success", message: `Row ${row} updated.` }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Default: INSERT
    const newRow = headers.map(header =>
      header === 'Date' ? new Date() : e.parameter[header]
    );
    const nextRow = sheet.getLastRow() + 1;
    sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success', row: nextRow }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}








