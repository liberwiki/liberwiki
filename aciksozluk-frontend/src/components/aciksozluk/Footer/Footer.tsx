import config from '@/config'
import { useServerTranslation } from '@/i18n'

export async function Footer() {
  const { t } = await useServerTranslation(['footer'])
  return (
    <footer className="py-6 md:px-8 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
          {t('footer:headline', { name: config.name })}
        </p>
      </div>
    </footer>
  )
}
