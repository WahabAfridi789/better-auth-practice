"use client"


import { BetterAuthActionButton } from "@/components/auth/better-auth-action-button"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth/auth-client"
import { SUPPORTED_OAUTH_PROVIDERS, SUPPORTED_OAUTH_PROVIDER_DETAILS } from "@/lib/auth/o-auth-providers"


export function SocialAuthButtons({ callbackUrl }: { callbackUrl?: string }) {
  return SUPPORTED_OAUTH_PROVIDERS.map(provider => {
    const Icon = SUPPORTED_OAUTH_PROVIDER_DETAILS[provider].Icon

    return (
      <BetterAuthActionButton
        variant="outline"
        key={provider}
        action={() => {
          return authClient.signIn.social({
            provider,
            callbackURL: window.location.origin + callbackUrl,
          })
        }}
      >
        <Icon />
        {SUPPORTED_OAUTH_PROVIDER_DETAILS[provider].name}
      </BetterAuthActionButton>
    )
  })
}