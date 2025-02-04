'use server'

import Link from 'next/link'

import { buttonVariants } from '@/components/shadcn/button'

import { sUseTranslation } from '@/i18n'
import { cn } from '@/lib/utils'

export default async function NotFound() {
  const { t } = await sUseTranslation(['common'])

  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <div className="text-center p-8">
        <h1 className="text-4xl text-white mb-6 font-light">{t('common:pageNotFound')}</h1>
        <Link href={'/'} className={cn(buttonVariants({ variant: 'outline' }))}>
          {t('common:returnToHome')}
        </Link>
      </div>
    </div>
  )
}
