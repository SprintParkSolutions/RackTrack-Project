const rawSiteUrl = import.meta.env.VITE_SALESFORCE_SITE_URL?.trim() || ''
const rawSitePath = import.meta.env.VITE_SALESFORCE_SITE_PATH?.trim() || ''

const BASE_URL = rawSiteUrl.replace(/\/+$/, '')
const SITE_PATH = rawSitePath ? `/${rawSitePath.replace(/^\/+|\/+$/g, '')}` : ''
const RACKTRACK_BASE_URL = `${BASE_URL}${SITE_PATH}/services/apexrest/racktrack`

export type RackTrackLeadPayload = {
  fullName: string
  email: string
  companyName: string
  rackCount: string
  requirement: string
  description: string
  mobileCountry: string
  mobileNumber: string
}

export type SalesforceMutationResponse = {
  success: boolean
  message: string
  leadId?: string
}

async function parseResponse(response: Response): Promise<unknown> {
  const text = await response.text()
  if (!text) return {}

  try {
    return JSON.parse(text)
  } catch {
    return { message: text }
  }
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : undefined
}

function asString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined
}

function getMissingConfigMessage() {
  return 'Salesforce site URL or path is not configured. Set VITE_SALESFORCE_SITE_URL and VITE_SALESFORCE_SITE_PATH in your environment file.'
}

function getHttpErrorMessage(status: number, fallback?: string) {
  if (status === 400) {
    return fallback || 'Salesforce rejected the payload. Please verify the submitted fields.'
  }

  if (status === 403) {
    return (
      fallback ||
      'Salesforce denied this request. Check Experience Cloud guest user access to the Apex REST class, Lead create permission, field-level access, and site/CORS settings.'
    )
  }

  if (status === 404) {
    return (
      fallback ||
      'Salesforce endpoint not found. Verify VITE_SALESFORCE_SITE_PATH and the /services/apexrest/racktrack/lead route.'
    )
  }

  if (status >= 500) {
    return fallback || 'Salesforce encountered a server error while creating the lead.'
  }

  return fallback || `Unable to create lead. HTTP ${status}.`
}

export async function createRackTrackLead(
  payload: RackTrackLeadPayload,
): Promise<SalesforceMutationResponse> {
  if (!BASE_URL || !rawSitePath) {
    return { success: false, message: getMissingConfigMessage() }
  }

  try {
    const response = await fetch(`${RACKTRACK_BASE_URL}/lead`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: payload.fullName.trim(),
        email: payload.email.trim(),
        companyName: payload.companyName.trim(),
        rackCount: payload.rackCount.trim(),
        requirement: payload.requirement.trim(),
        description: payload.description.trim(),
        mobileCountry: payload.mobileCountry.trim(),
        mobileNumber: payload.mobileNumber.trim(),
      }),
    })

    const data = asRecord(await parseResponse(response))
    const success = response.ok && data?.success === true

    return {
      success,
      leadId: asString(data?.leadId),
      message: success
        ? asString(data?.message) || 'Lead created successfully.'
        : getHttpErrorMessage(response.status, asString(data?.message)),
    }
  } catch (error) {
    console.error('Error creating RackTrack lead:', error)
    return {
      success: false,
      message:
        'Could not reach Salesforce. Check the org URL, site path, CORS, and guest user Apex REST access.',
    }
  }
}
