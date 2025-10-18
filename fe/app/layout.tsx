import { Providers } from '@/features/providers'
import './globals.css'
import FooterComponent from '../components/Footer/footer'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body>
        <Providers>{children}</Providers>
        <FooterComponent />
      </body>
    </html>
  )
}