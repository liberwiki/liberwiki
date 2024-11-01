import NavTitle from '@/components/liberwiki/NavTitle'

import { useLiberWikiAPI as sUseLiberWikiAPI } from '@/lib/serverHooks'

export async function LeftColumn() {
  const liberwiki = sUseLiberWikiAPI()
  const { data: titles } = await liberwiki.titles({ entry_count__gt: 0 })

  return (
    <div className="w-full">
      <div className="pb-4">
        {titles?.results?.map((title) => (
          <NavTitle key={title.id} title={title}>
            {title.name}
          </NavTitle>
        ))}
      </div>
    </div>
  )
}
