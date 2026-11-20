# Google Apps Script

Este proyecto recibe solicitudes firmadas por la funcion serverless y escribe cada registro en la planilla privada de la bodega indicada.

La hoja `Registros` conserva los campos base y agrega datos del visitante como apellido, ciudad, pais, red social, intereses, origen de llegada y consentimiento comercial. El JSON completo de `fields` tambien se conserva para permitir nuevos campos sin perder informacion.

## Propiedades requeridas

Configurar en `Project Settings > Script properties`:

```text
SHARED_SECRET=un-secreto-largo-compartido-con-el-proxy
TENANT_BODEGA_AURORA_SHEET_ID=id-privado-de-la-planilla
```

Para otra bodega, usar la misma regla:

```text
TENANT_<SLUG_EN_MAYUSCULAS>_SHEET_ID=<spreadsheet-id>
```

Los IDs no deben estar en Vue ni en ningun archivo publico.

## Despliegue

1. Crear un proyecto independiente de Apps Script.
2. Copiar `Code.js` y `appsscript.json`.
3. Configurar las propiedades privadas.
4. Verificar que la cuenta que ejecuta el script tenga acceso de escritura a cada planilla.
5. Publicar como Web app ejecutando como la cuenta propietaria.
6. Permitir el acceso anonimo porque el navegador no inicia sesion en Google.
7. Usar la URL `/exec` en `APPS_SCRIPT_URL` del proxy.

La URL puede ser publica, pero el endpoint no acepta solicitudes sin la firma HMAC correcta.
