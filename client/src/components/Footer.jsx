import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='flex items-center justify-between gap-4 py-3 mt-20'>

        <img src={assets.logo} alt="" width={150} />

        <p className='flex-1 border-l border-gray-400 pl-4 text-sm
        text-gray-500 max-sm:hidden'>Copyright @Imagify.dev | All right reserved.</p>

        <div className='flex gap-2.5'>
            {/* social media links */}
            <a href="http://www.linkedin.com/in/anurag-singh81105/" target='_blank'>
            <img src={assets.linkedin_icon} alt="" width={35}/>
            </a>
            <a href='https://github.com/Anurag-Singh-08' target='_blank'>
            <img src={assets.github_icon} alt="" width={35}/>
            </a>
            <a href='' target="_blank">
            <img src={assets.instagram_icon} alt="" width={35}/>
            </a>
        </div>

    </div>
  )
}

export default Footer
