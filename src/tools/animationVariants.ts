import { Variants } from "framer-motion"

interface Options {
    delay?: number
    vertical?: boolean
    opacityOnly?: boolean
    reversed?: boolean
}

export const animationVariants: (options?: Options) => Variants = (options) => {
    const animation = {
        initial: { x: -100, y: 0, opacity: 0 },
        animate: { x: 0, y: 0, opacity: 1, transition: { type: "spring", stiffness: 25, delay: options?.delay || 0 } },
    }

    if (options?.vertical) {
        animation.initial.x = 0
        animation.animate.x = 0
        animation.initial.y = options.reversed ? 100 : -100
        animation.animate.y = 0
    } else if (options?.reversed) {
        animation.initial.x = options.reversed ? 100 : -100
        animation.animate.x = 0
    }

    if (options?.opacityOnly) {
        animation.initial.x = 0
        animation.animate.x = 0
        animation.initial.y = 0
        animation.animate.y = 0
    }

    return animation
}
