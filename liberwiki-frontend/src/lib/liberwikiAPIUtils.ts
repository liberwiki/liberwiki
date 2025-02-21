import { toast } from 'sonner'

export function APIErrorToast(error: Record<string, string[]> | undefined, toastMessage: string) {
  if (error) {
    Object.values(error).forEach((messages) => {
      messages.forEach((message) => {
        toast(toastMessage, { description: message })
      })
    })
  }
}
