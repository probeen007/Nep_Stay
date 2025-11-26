import { motion } from 'framer-motion'
import { cn } from '../../utils/helpers'

// Card component with hover animations
const Card = ({
  children,
  className,
  hover = false,
  padding = 'md',
  ...props
}) => {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }
  
  const cardClasses = cn(
    hover ? 'card-hover' : 'card',
    paddings[padding],
    className
  )

  const MotionDiv = hover ? motion.div : 'div'

  const hoverProps = hover ? {
    whileHover: { y: -5 },
    transition: { duration: 0.3 }
  } : {}

  return (
    <MotionDiv
      className={cardClasses}
      {...hoverProps}
      {...props}
    >
      {children}
    </MotionDiv>
  )
}

export default Card