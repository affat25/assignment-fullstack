
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import{dark} from '@clerk/themes'
import './globals.css'

import { ThemeProvider } from '@/components/theme-provider'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider appearance={{baseTheme: dark}}>
      <html lang="en">
        <body>
          <ThemeProvider
            attribute='class'
            forcedTheme='dark'
            storageKey='twitchclone-theme'
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}