import './globals.css';

export const metadata = {
  title: 'Smilu - Mobile Vocab Duels',
  description: 'Intellectual multiplayer vocabulary duel game for SSC CGL prep.',
  manifest: '/manifest.json',
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌵</text></svg>",
    apple: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23101010'/><text y='.9em' font-size='90'>🌵</text></svg>"
  },
  appleWebApp: {
    title: 'Smilu',
    statusBarStyle: 'black-translucent',
    capable: true,
  },
  themeColor: '#050505'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <div className="mobile-app-frame">
          {children}
        </div>
      </body>
    </html>
  );
}
