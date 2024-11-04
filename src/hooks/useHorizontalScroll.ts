import { useRef, useEffect } from "react"

export function useHorizontalScroll() {
    const elRef = useRef<HTMLDivElement>()
    useEffect(() => {
        const el = elRef.current
        if (el) {
            const onWheel = (e: WheelEvent) => {
                console.log("a")
                if (e.deltaY == 0) return
                e.preventDefault()
                el.scrollTo({
                    left: el.scrollLeft + e.deltaY * 1,
                    // behavior: "smooth"
                })
            }
            el.addEventListener("wheel", onWheel)
            return () => el.removeEventListener("wheel", onWheel)
        }
    }, [])
    return elRef
}
