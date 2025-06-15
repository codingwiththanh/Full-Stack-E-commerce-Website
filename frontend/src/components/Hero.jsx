import React from 'react'
import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"
import { assets } from '../assets/assets'

const Hero = () => {
  const AutoplayPlugin = (slider) => {
    let timeout
    let mouseOver = false

    function clearNextTimeout() {
      clearTimeout(timeout)
    }

    function nextTimeout() {
      clearTimeout(timeout)
      if (mouseOver) return
      timeout = setTimeout(() => {
        slider.next()
      }, 3000) // tăng thời gian autoplay cho trải nghiệm tốt hơn
    }

    slider.on("created", () => {
      slider.container.addEventListener("mouseover", () => {
        mouseOver = true
        clearNextTimeout()
      })
      slider.container.addEventListener("mouseout", () => {
        mouseOver = false
        nextTimeout()
      })
      nextTimeout()
    })
    slider.on("dragStarted", clearNextTimeout)
    slider.on("animationEnded", nextTimeout)
    slider.on("updated", nextTimeout)
  }

  const heroImages = [
    assets.hero_img2,
    assets.hero_img3,
    assets.hero_img4,
  ]

  const [sliderRef] = useKeenSlider(
    {
      loop: true,
      slides: { perView: 1 },
    },
    [AutoplayPlugin]
  )

  return (
    <div
      ref={sliderRef}
      className='keen-slider sm:h-[284px] lg:h-[588px]'
    >
      {heroImages.map((img, index) => (
        <div className='keen-slider__slide' key={index}>
          <img
            src={img}
            alt={`hero-${index}`}
            className='w-full h-full object-cover object-center'
          />
        </div>
      ))}
    </div>
  )
}

export default Hero
