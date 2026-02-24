import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#000000',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: '#EAB308',
            fontFamily: 'sans-serif',
          }}
        >
          R
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
