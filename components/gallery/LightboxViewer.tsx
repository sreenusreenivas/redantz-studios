'use client'

import Lightbox from 'yet-another-react-lightbox'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen'
import Counter from 'yet-another-react-lightbox/plugins/counter'
import Download from 'yet-another-react-lightbox/plugins/download'
import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/thumbnails.css'
import 'yet-another-react-lightbox/plugins/counter.css'

interface Slide { src: string; width: number; height: number; alt?: string; download?: string }

interface Props {
  open: boolean
  index: number
  slides: Slide[]
  onClose: () => void
  withDownload?: boolean
}

export default function LightboxViewer({ open, index, slides, onClose, withDownload }: Props) {
  return (
    <Lightbox
      open={open}
      index={index}
      close={onClose}
      slides={slides}
      plugins={withDownload
        ? [Zoom, Thumbnails, Fullscreen, Counter, Download]
        : [Zoom, Thumbnails, Fullscreen, Counter]}
      carousel={{ finite: false, preload: 3 }}
      controller={{ closeOnBackdropClick: true }}
      zoom={{ maxZoomPixelRatio: 3 }}
      styles={{
        container: { backgroundColor: 'rgba(0,0,0,0.97)' },
        button: { color: 'rgba(255,255,255,0.65)' },
      }}
    />
  )
}
