import { WebhookRequestBody } from '@line/bot-sdk'

const WebhookEndpointList = [
  'https://webhook.site/6b91908b-c7e8-4541-90ca-cfcaf66c3b87',
  'https://webhook.site/a531b5cf-4852-4af3-b66d-b174056c677b',
]

export default {
  async fetch(request, env, ctx): Promise<Response> {
    // Filter only POST method
    const { method, headers } = request
    if (method !== 'POST') {
      return Response.json({ message: 'Method not allowed' }, { status: 405 })
    }

    // Handle Webhook (Code Start Here)
    const body = await request.arrayBuffer()

    // Send to Multiple Webhook Endpoint
    await Promise.all(
      WebhookEndpointList.map(async (url) => {
        await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-line-signature': headers.get('x-line-signature') || '',
            'user-agent': headers.get('user-agent') || '',
          },
          body,
        })
      })
    )

    // Response Success to LINE Webhook Service
    return Response.json({ message: 'Success' })
  },
} satisfies ExportedHandler<Env>
