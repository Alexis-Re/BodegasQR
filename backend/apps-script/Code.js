function doPost(event) {
  try {
    if (!event || !event.postData || !event.postData.contents) {
      return jsonResponse_({ ok: false, code: 'EMPTY_REQUEST' });
    }

    var envelope = JSON.parse(event.postData.contents);
    var properties = PropertiesService.getScriptProperties();
    var secret = properties.getProperty('SHARED_SECRET');

    if (!secret || !envelope.message || !envelope.signature) {
      return jsonResponse_({ ok: false, code: 'BACKEND_NOT_CONFIGURED' });
    }

    var expectedSignature = Utilities.base64Encode(
      Utilities.computeHmacSha256Signature(envelope.message, secret)
    );

    if (!constantTimeEquals_(envelope.signature, expectedSignature)) {
      return jsonResponse_({ ok: false, code: 'INVALID_SIGNATURE' });
    }

    var signedRequest = JSON.parse(envelope.message);
    var payload = signedRequest.payload;
    var timestamp = Number(signedRequest.timestamp);

    if (!timestamp || Math.abs(new Date().getTime() - timestamp) > 5 * 60 * 1000) {
      return jsonResponse_({ ok: false, code: 'EXPIRED_REQUEST' });
    }

    validatePayload_(payload);

    var propertyKey = 'TENANT_' + payload.tenantSlug.toUpperCase().replace(/-/g, '_') + '_SHEET_ID';
    var spreadsheetId = properties.getProperty(propertyKey);

    if (!spreadsheetId) {
      return jsonResponse_({ ok: false, code: 'TENANT_NOT_CONFIGURED' });
    }

    var lock = LockService.getScriptLock();
    lock.waitLock(10000);

    try {
      var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
      var sheet = getOrCreateRecordsSheet_(spreadsheet);
      var duplicate = findRequest_(sheet, payload.requestId);

      if (duplicate) {
        return jsonResponse_({ ok: true, recordId: duplicate, duplicate: true });
      }

      var recordId = Utilities.getUuid();
      sheet.appendRow([
        recordId,
        new Date().toISOString(),
        safeCellValue_(payload.tenantSlug),
        safeCellValue_(payload.formId),
        safeCellValue_(payload.fields.name),
        safeCellValue_(payload.fields.email),
        safeCellValue_(payload.fields.phone),
        safeCellValue_(JSON.stringify(payload.fields)),
         safeCellValue_(payload.source || 'direct'),
         payload.consent === true,
         safeCellValue_(payload.requestId),
         safeCellValue_(payload.fields.surname),
         safeCellValue_(payload.fields.city),
         safeCellValue_(payload.fields.country),
         safeCellValue_(payload.fields.socialNetwork),
         safeCellValue_(payload.fields.socialHandle),
         safeCellValue_(payload.fields.interest),
         safeCellValue_(payload.fields.discoverySource),
         payload.fields.marketingConsent === true
       ]);
      SpreadsheetApp.flush();

      return jsonResponse_({ ok: true, recordId: recordId });
    } finally {
      lock.releaseLock();
    }
  } catch (error) {
    console.error(error);
    return jsonResponse_({ ok: false, code: 'STORAGE_ERROR' });
  }
}

function validatePayload_(payload) {
  if (!payload || typeof payload !== 'object') throw new Error('Invalid payload');
  if (!/^[a-z0-9-]{3,80}$/.test(payload.tenantSlug || '')) throw new Error('Invalid tenant');
  if (!/^[a-z0-9-]{3,80}$/.test(payload.formId || '')) throw new Error('Invalid form');
  if (!/^[a-zA-Z0-9-]{8,120}$/.test(payload.requestId || '')) throw new Error('Invalid request id');
  if (payload.honeypot) throw new Error('Rejected request');
   if (payload.consent !== true) throw new Error('Consent required');
   if (!payload.fields || typeof payload.fields !== 'object') throw new Error('Invalid fields');
   if (String(payload.fields.name || '').trim().length < 2 || String(payload.fields.name).length > 60) throw new Error('Invalid name');
   if (String(payload.fields.surname || '').trim().length < 2 || String(payload.fields.surname).length > 80) throw new Error('Invalid surname');
   if (!/^\S+@\S+\.\S+$/.test(String(payload.fields.email || '')) || String(payload.fields.email).length > 120) throw new Error('Invalid email');
   if (String(payload.fields.phone || '').length > 30) throw new Error('Invalid phone');
   if (String(payload.fields.city || '').trim().length < 2 || String(payload.fields.city).length > 80) throw new Error('Invalid city');
   if (!String(payload.fields.country || '').length || String(payload.fields.country).length > 40) throw new Error('Invalid country');
   if (String(payload.fields.socialNetwork || '').length > 40) throw new Error('Invalid social network');
   if (String(payload.fields.socialHandle || '').length > 160) throw new Error('Invalid social handle');
   if (String(payload.fields.interest || '').length > 60) throw new Error('Invalid interest');
   if (String(payload.fields.discoverySource || '').length > 60) throw new Error('Invalid discovery source');
   if (typeof payload.fields.marketingConsent !== 'boolean') throw new Error('Invalid marketing consent');
   if (String(payload.fields.qrLocation || '').length > 80) throw new Error('Invalid QR location');
   if (String(payload.fields.qrId || '').length > 120) throw new Error('Invalid QR id');
}

function getOrCreateRecordsSheet_(spreadsheet) {
   var sheet = spreadsheet.getSheetByName('Registros');
   var headers = [
     'record_id',
     'created_at',
     'tenant_slug',
     'form_id',
     'name',
     'email',
     'phone',
     'fields_json',
     'source',
     'consent',
     'request_id',
     'surname',
     'city',
     'country',
     'social_network',
     'social_handle',
     'interest',
     'discovery_source',
     'marketing_consent'
   ];

   if (!sheet) {
     sheet = spreadsheet.insertSheet('Registros');
   }

   if (sheet.getLastRow() === 0) {
     sheet.appendRow(headers);
   } else {
     ensureHeaders_(sheet, headers);
   }

   return sheet;
}

function ensureHeaders_(sheet, headers) {
  var existingHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

  headers.forEach(function(header) {
    if (existingHeaders.indexOf(header) !== -1) return;

    sheet.getRange(1, sheet.getLastColumn() + 1).setValue(header);
    existingHeaders.push(header);
  });
}

function findRequest_(sheet, requestId) {
  if (sheet.getLastRow() < 2) return null;

  var requestColumn = sheet.getRange(2, 11, sheet.getLastRow() - 1, 1);
  var match = requestColumn.createTextFinder(requestId).matchEntireCell(true).findNext();

  if (!match) return null;
  return String(sheet.getRange(match.getRow(), 1).getValue());
}

function safeCellValue_(value) {
  var text = String(value == null ? '' : value);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function constantTimeEquals_(left, right) {
  if (typeof left !== 'string' || typeof right !== 'string' || left.length !== right.length) return false;

  var difference = 0;
  for (var index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }

  return difference === 0;
}

function jsonResponse_(body) {
  return ContentService
    .createTextOutput(JSON.stringify(body))
    .setMimeType(ContentService.MimeType.JSON);
}
