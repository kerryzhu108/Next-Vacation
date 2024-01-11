import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <div className='h-full flex justify-center items-center '>
      <div className=''>
        Cant decide on where to go for your next travel destination?<br/>
        I got you covered!
        Answer a few questions to help me decide where you &apos;d like to go.
      </div>
      <Link href='/questions' title='continue'>continue</Link> 
    </div>
  )
}
