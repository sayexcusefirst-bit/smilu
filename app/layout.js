import './globals.css';

export const metadata = {
  title: 'Smilu - Mobile Vocab Duels',
  description: 'Intellectual multiplayer vocabulary duel game for SSC CGL prep.',
  manifest: '/manifest.json',
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
