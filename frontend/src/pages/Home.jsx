import React from 'react'
import Navbar from '../components/Navbar'
import HeroSlider from '../components/HeroSlider'
import AboutSection from '../components/AboutSection'
import Testimonials from '../components/Testimonials'
import FaqPage from '../components/FaqPage'
import BlogPage from '../components/BlogPage'
import Footer from '../components/Footer'

const Home = () => {
  return (
   <>
   <Navbar/>
   <HeroSlider/>
   <BlogPage/>
   <AboutSection/>
   <Testimonials/>
     <FaqPage/>
     <Footer/>
   </>
  )
}

export default Home