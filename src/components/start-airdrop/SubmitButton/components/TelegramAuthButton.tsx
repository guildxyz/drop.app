import { ReactElement, useEffect, useRef } from "react"

type Props = {
  botName: string
  onAuth: (user: TelegramUser) => void
  borderRadius?: number
  widgetVersion?: number
}

export type TelegramUser = {
  id: number
  first_name: string
  username: string
  photo_url: string
  auth_date: number
  hash: string
}

declare global {
  interface Window {
    TelegramLoginWidget: {
      onAuth: (user: TelegramUser) => void
    }
  }
}

const TelegramAuthButton = ({
  botName,
  onAuth,
  borderRadius = 10,
  widgetVersion = 15,
}: Props): ReactElement => {
  const telegramAuthButton = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    window.TelegramLoginWidget = {
      onAuth: (user: TelegramUser) => onAuth(user),
    }

    const script = document.createElement("script")
    script.src = `https://telegram.org/js/telegram-widget.js?${widgetVersion}`
    script.setAttribute("data-telegram-login", botName)
    script.setAttribute("data-size", "large")
    script.setAttribute("data-radius", borderRadius.toString())
    script.setAttribute("data-request-access", "write")
    script.setAttribute("data-onauth", "TelegramLoginWidget.onAuth(user)")
    script.async = true
    telegramAuthButton.current?.appendChild(script)
  }, [])

  return <div id="tgauth" ref={telegramAuthButton}></div>
}

export default TelegramAuthButton
