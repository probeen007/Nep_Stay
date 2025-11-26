import { motion } from 'framer-motion'
import { useIntersectionObserver } from '../../hooks'

// Wrapper component for scroll animations
const AnimateOnScroll = ({
  children,
  animation = 'slideUp',
  delay = 0,
  duration = 0.6,
  className = '',
  threshold = 0.1,
  once = true,
  ...props
}) => {
  const { elementRef, isVisible, hasBeenVisible } = useIntersectionObserver({
    threshold,
    rootMargin: '50px'
  })

  // Animation variants
  const animations = {
    slideUp: {
      hidden: { opacity: 0, y: 50 },
      visible: { opacity: 1, y: 0 }
    },
    slideDown: {
      hidden: { opacity: 0, y: -50 },
      visible: { opacity: 1, y: 0 }
    },
    slideLeft: {
      hidden: { opacity: 0, x: 50 },
      visible: { opacity: 1, x: 0 }
    },
    slideRight: {
      hidden: { opacity: 0, x: -50 },
      visible: { opacity: 1, x: 0 }
    },
    fadeIn: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 }
    },
    scaleUp: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1 }
    },
    scaleDown: {
      hidden: { opacity: 0, scale: 1.2 },
      visible: { opacity: 1, scale: 1 }
    }
  }

  const shouldAnimate = once ? hasBeenVisible : isVisible

  return (
    <motion.div
      ref={elementRef}
      className={className}
      initial="hidden"
      animate={shouldAnimate ? "visible" : "hidden"}
      variants={animations[animation]}
      transition={{ 
        duration, 
        delay,
        ease: [0.25, 0.46, 0.45, 0.94] // Custom easing for smoother animation
      }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default AnimateOnScroll