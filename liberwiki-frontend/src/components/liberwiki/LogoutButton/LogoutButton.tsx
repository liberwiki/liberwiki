import { LogoutButton as ClientLogoutButton } from '@/components/liberwiki/LogoutButton/client'
import { Button } from '@/components/shadcn/button'

export function LogoutButton(props: Omit<React.ComponentPropsWithoutRef<typeof Button>, 'onClick'>) {
  const { children, ...buttonProps } = props
  return <ClientLogoutButton {...buttonProps}>{children}</ClientLogoutButton>
}
