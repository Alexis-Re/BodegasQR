async function signMessage(message, secret) {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(message))
  const bytes = new Uint8Array(signature)
  let binary = ''

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })

  return btoa(binary)
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store'
    }
  })
}

function isValidPayload(payload) {
  if (!payload || typeof payload !== 'object') return false
  if (!/^[a-z0-9-]{3,80}$/.test(payload.tenantSlug || '')) return false
  if (!/^[a-z0-9-]{3,80}$/.test(payload.formId || '')) return false
  if (!/^[a-zA-Z0-9-]{8,120}$/.test(payload.requestId || '')) return false
  if (payload.consent !== true) return false
  if (payload.honeypot) return false
  if (!payload.fields || typeof payload.fields !== 'object') return false
  if (typeof payload.fields.name !== 'string' || payload.fields.name.trim().length < 2) return false
  if (payload.fields.name.length > 60) return false
  if (typeof payload.fields.surname !== 'string' || payload.fields.surname.trim().length < 2) return false
  if (payload.fields.surname.length > 80) return false
  if (typeof payload.fields.email !== 'string' || !/^\S+@\S+\.\S+$/.test(payload.fields.email)) return false
  if (payload.fields.email.length > 120) return false
  if (typeof payload.fields.phone !== 'string' || !payload.fields.phone.trim() || payload.fields.phone.length > 30) return false
  if (typeof payload.fields.marketingConsent !== 'boolean') return false
  if (typeof payload.fields.qrLocation !== 'string' || payload.fields.qrLocation.length > 80) return false
  if (typeof payload.fields.qrId !== 'string' || payload.fields.qrId.length > 120) return false

  return true
}

function keepRegisteredFields(fields) {
  const allowedFields = [
    'name',
    'surname',
    'email',
    'phone',
    'marketingConsent',
    'qrLocation',
    'qrId'
  ]

  return Object.fromEntries(
    Object.entries(fields).filter(([fieldName]) => allowedFields.includes(fieldName))
  )
}

export async function onRequestPost({ request, env }) {
  if (!env.APPS_SCRIPT_URL || !env.APPS_SCRIPT_SHARED_SECRET) {
    return jsonResponse({
      ok: false,
      code: 'BACKEND_NOT_CONFIGURED',
      message: 'El servicio de registros no esta configurado.'
    }, 503)
  }

  let payload

  try {
    payload = await request.json()
  } catch {
    return jsonResponse({ ok: false, code: 'INVALID_JSON', message: 'La solicitud no es valida.' }, 400)
  }

  if (!isValidPayload(payload)) {
    return jsonResponse({ ok: false, code: 'INVALID_PAYLOAD', message: 'Los datos enviados no son validos.' }, 400)
  }

  payload.fields = keepRegisteredFields(payload.fields)

  const timestamp = Date.now()
  const message = JSON.stringify({ timestamp, payload })
  const signature = await signMessage(message, env.APPS_SCRIPT_SHARED_SECRET)

  try {
    const response = await fetch(env.APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message, signature })
    })

    const result = await response.json().catch(() => null)

    if (!response.ok || !result?.ok) {
      return jsonResponse({
        ok: false,
        code: result?.code || 'STORAGE_FAILED',
        message: 'No pudimos confirmar el guardado del registro.'
      }, 502)
    }

    return jsonResponse({ ok: true, recordId: result.recordId }, 201)
  } catch {
    return jsonResponse({
      ok: false,
      code: 'UPSTREAM_UNAVAILABLE',
      message: 'El servicio de registros no esta disponible.'
    }, 502)
  }
}
