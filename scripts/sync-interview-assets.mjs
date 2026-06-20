/*
  Auto-copies your interview assets from src/assets/interview/ into
  public/assets/interview/ with the exact filenames the app expects.

  Why: Vite serves files from public/, but replacing the whole frontend folder
  resets public/. Keeping your master files in src/assets/interview/ (which is
  preserved) and running this on every `npm run dev` / `npm run build` means you
  never have to copy or rename anything by hand again.

  Just drop your files in src/assets/interview/ using any reasonable name:
    - a room background  (*.jpg / *.jpeg / *.png containing "room" or "bg")
    - a 3D model         (*.glb and/or *.vrm)
    - optional photos    (avatar-*.png) are copied as-is too
*/
import { existsSync, mkdirSync, readdirSync, copyFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const SRC = join(root, 'src', 'assets', 'interview')
const DST = join(root, 'public', 'assets', 'interview')

if (!existsSync(SRC)) {
  console.log('[sync-assets] no src/assets/interview/ folder — skipping (using whatever is already in public/).')
  process.exit(0)
}
mkdirSync(DST, { recursive: true })

const files = readdirSync(SRC).filter((f) => !f.startsWith('.'))
const lower = (f) => f.toLowerCase()
const copy = (from, toName) => { copyFileSync(join(SRC, from), join(DST, toName)); console.log(`[sync-assets] ${from} -> ${toName}`) }

// 1) copy everything as-is (so any extra files are available too)
for (const f of files) copy(f, f)

// 2) ensure the exact names the app loads, picking the best candidate
const bg = files.find((f) => /(room|bg)/i.test(f) && /\.(jpe?g|png)$/i.test(f))
if (bg) copy(bg, 'interview-room-bg.jpg')

const vrm = files.find((f) => lower(f).endsWith('.vrm'))
if (vrm) copy(vrm, 'avatar-female-interviewer.vrm')

const glb = files.find((f) => lower(f).endsWith('.glb'))
if (glb) copy(glb, 'avatar-female-interviewer.glb')

const headshot = files.find((f) => /avatar/i.test(f) && /seated/i.test(f) === false && /\.png$/i.test(f))
if (headshot) copy(headshot, 'avatar-female-interviewer.png')

console.log('[sync-assets] done.')
