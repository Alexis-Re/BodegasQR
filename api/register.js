import { onRequestPost } from '../functions/api/register.js'

export async function POST(request) {
  return onRequestPost({
    request,
    env: {
      APPS_SCRIPT_URL: process.env.APPS_SCRIPT_URL,
      APPS_SCRIPT_SHARED_SECRET: process.env.APPS_SCRIPT_SHARED_SECRET
    }
  })
}
