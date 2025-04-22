import React from 'react'
import Header from '../components/Header'
import Steps from '../components/Steps'
import Description from '../components/Description'
import Testimonials from '../components/Testimonials'
import GenerateBtn from '../components/GenerateBtn'

const Home = () => {
  return (
    <div className="pt-16 bg-gradient-to-b from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Header/>
        <Steps/>
        <Description/>
        <Testimonials/>
        <GenerateBtn/>
      </div>
    </div>
  )
}

export default Home