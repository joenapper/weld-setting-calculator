import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Self-hosted fonts (only the weights the app uses) — served same-origin so they
// aren't render-blocking and load fast enough to avoid the font-swap layout shift.
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/oswald/400.css'
import '@fontsource/oswald/500.css'
import '@fontsource/space-mono/400.css'
import '@fontsource/space-mono/700.css'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
