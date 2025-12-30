import { ProfileProvider } from '@/contexts/ProfileContext';
import './globals.css';

export const metadata = {
  title: 'SafePass - Visitor Management System',
  description: 'Secure visitor and access management',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
<ProfileProvider>
          {children}
        </ProfileProvider>
</body>
    </html>
  )
}