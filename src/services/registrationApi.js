const configuredEndpoint = import.meta.env.VITE_REGISTRATION_API_URL

export async function submitRegistration(payload) {
  if (!configuredEndpoint) {
    return {
      ok: false,
      code: 'NOT_CONFIGURED',
      message: 'El formulario esta listo, pero el backend todavia no esta configurado. No se guardo el registro.'
    }
  }

  try {
    const response = await fetch(configuredEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    const result = await response.json().catch(() => null)

    if (!response.ok || !result?.ok) {
      return {
        ok: false,
        code: result?.code || 'REQUEST_FAILED',
        message: result?.message || 'No pudimos confirmar el registro. Intenta nuevamente.'
      }
    }

    return { ok: true, recordId: result.recordId }
  } catch {
    return {
      ok: false,
      code: 'NETWORK_ERROR',
      message: 'No pudimos conectar con el servicio. No se confirmo el registro.'
    }
  }
}
