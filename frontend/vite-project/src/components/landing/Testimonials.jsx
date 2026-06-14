import React from 'react'
import { Star, Quote } from 'lucide-react'
import { TESTIMONIALS } from '../../utils/data'

const Testimonials = () => {
  return (
    <div id='testimonials' className="">
      
      {/* Decorative Elements */}
      <div className=""></div>
      <div className=""></div>

      <div className="">
        
        {/* Header */}
        <div className="">
          <div className="">
            <Star className="" />
            <span className="">Testimonials</span>
          </div>

          <h2 className="">
            Loved by Creators
            <span className="">
              Everywhere
            </span>
          </h2>

          <p className="">
            Don't just take our word for it. Here's what our users
          </p>
        </div>

      </div>
    </div>
  )
}

export default Testimonials