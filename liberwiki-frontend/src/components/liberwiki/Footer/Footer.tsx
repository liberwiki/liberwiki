import config from '@/config'
import { sUseTranslation } from '@/i18n'

export async function Footer() {
  const { t } = await sUseTranslation(['footer'])

  return (
    <footer className="py-6 md:px-8 text-muted-foreground">
      <div className="container flex flex-col justify-center gap-4">
        <p className="text-balance text-center text-sm leading-loose md:text-left">
          {t('footer:headline', { name: config.name })}
        </p>
      </div>
    </footer>
  )
}
