import * as Icons from 'lucide-react'

import {
  AddEmailForm,
  DeleteEmailButton,
  MarkEmailPrimaryButton,
  ResendVerificationEmailButton,
} from '@/components/liberwiki/Profile/Emails/client'
import { Badge } from '@/components/shadcn/badge'
import { Button } from '@/components/shadcn/button'
import { Overlay, OverlayClose, OverlayContent, OverlayTrigger } from '@/components/shadcn/overlay'

import { sUseTranslation } from '@/i18n'
import { useLiberWikiAPI as sUseLiberWikiAPI } from '@/lib/serverHooks'

export async function Emails() {
  const liberwiki = sUseLiberWikiAPI()
  const { t } = await sUseTranslation(['common', 'profile'])

  const { data } = await liberwiki.auth.emails()
  const emails = data?.data as { email: string; primary: boolean; verified: boolean }[] | undefined
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 items-center justify-center">
        <h2 className="text-2xl font-bold">{t('profile:emails')}</h2>
        <p className="text-muted-foreground text-md">{t('profile:emailsDescription')}</p>
      </div>
      {emails ? (
        <ul className="flex flex-col gap-2">
          {emails.map((email) => (
            <li key={email.email} className="flex items-center justify-between py-2 px-3 border rounded">
              <div className="flex items-center gap-2">
                <span className="max-xs:text-sm">{email.email}</span>
                {email.verified ? (
                  <Badge variant="secondary" className="p-0.5">
                    <Icons.Check className="w-3 h-3" />
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="p-0.5">
                    <Icons.X className="w-3 h-3" />
                  </Badge>
                )}
                {email.primary && (
                  <Badge variant="secondary" className="p-0.5">
                    <Icons.Star className="w-3 h-3 fill-current" />
                  </Badge>
                )}
              </div>
              <Overlay breakpoint="md">
                <OverlayTrigger>
                  <Button variant="ghost" size="icon" disabled={email.primary}>
                    <Icons.MoreHorizontal className="h-4 w-4" />
                  </Button>
                </OverlayTrigger>
                <OverlayContent side="bottom" align="end">
                  <OverlayClose className="w-full">
                    {!email.primary && email.verified && (
                      <MarkEmailPrimaryButton variant="ghost" className="w-full justify-start" email={email.email}>
                        {t('profile:makePrimary')}
                      </MarkEmailPrimaryButton>
                    )}
                    {!email.verified && (
                      <ResendVerificationEmailButton
                        variant="ghost"
                        className="w-full justify-start"
                        email={email.email}
                      >
                        {t('profile:resendVerificationEmail')}
                      </ResendVerificationEmailButton>
                    )}
                    {!email.primary && (
                      <DeleteEmailButton variant="ghost" className="w-full justify-start" email={email.email}>
                        {t('profile:deleteEmail')}
                      </DeleteEmailButton>
                    )}
                  </OverlayClose>
                </OverlayContent>
              </Overlay>
            </li>
          ))}
        </ul>
      ) : (
        <span>{t('profile:youDontHaveAnyEmailAddresses')}</span>
      )}
      <AddEmailForm />
    </div>
  )
}
