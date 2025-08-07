const { GoogleSpreadsheet } = require('google-spreadsheet');

exports.handler = async (event, context) => {
  try {
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);

    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    });

    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    const newRow = JSON.parse(event.body);

    await sheet.addRow(newRow);

    return { statusCode: 200, body: JSON.stringify({ message: "Success" }) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
