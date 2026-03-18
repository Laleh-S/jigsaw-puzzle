import { useState } from "react"

import click from "./assets/click.mp3"
import "./App.css"

function App() {
  // initial state: the value you pass into useState(...) once at the beginning. { x: 0, y: 0 }
  // current state (piece1Pos): whatever the latest value is on this render.
  // next state: whatever you pass into setPiece1Pos(...) 
  // setPiece1Pos is the function that allows you make these changes

  const [piece1Pos, setPiece1Pos] = useState({ x: 0, y: 0 }) // Position lives here
  const [isDragging, setIsDragging] = useState(false)  // On and off switch for dragging
  
  const targetPos = { x: 200, y: 200 }
  const clickSound = new Audio(click) 


  function clamp(value, min, max) {  // guarantees the result is always between min and max
    if (value < min) return min // if too small return min
    if (value > max) return max // if too big return max
    return value // if in the middle return value unchanged
  }

  return (
    <div className="app">
      <h1>Jigsaw Puzzle</h1>
      <div
        className="piece-container"

        onMouseUp={() => {  // stop dragging (mouse button comes up)
          setIsDragging(false)
          // Measure how far the piece is from the target (left/right) or (up/down)
          const distanceX = Math.abs(piece1Pos.x - targetPos.x)
          const distanceY = Math.abs(piece1Pos.y - targetPos.y)
          
          // if it’s “close enough” (within 20 pixels in both directions)
          if (distanceX < 20 && distanceY < 20) {
            // if yes, snap it perfectly into place
            setPiece1Pos({ x: targetPos.x, y: targetPos.y })
            clickSound.play()
          }
        }}

        // between onMouseDown and onMouseUp moments, while isDragging is true, onMouseMove updates the piece position so it follows the mouse.
        onMouseMove={(event) => {
          // console.log(event)
          if (isDragging) { // only if we are draging do the followings
            // 220 value comes from the piece-container minus piece 
            const nextX = piece1Pos.x + event.movementX // Take the current x position of the piece. Add how far the mouse just moved left/right. This is where the piece wants to go next horizontally.
            const nextY = piece1Pos.y + event.movementY // Same idea for y (up/down).
            const clampedX = clamp(nextX, 0, 220) // If nextX is less than 0, use 0. If nextX is more than 220, use 220. Otherwise use nextX. → keeps the piece inside horizontally.
            const clampedY = clamp(nextY, 0, 220) // Same, but for the vertical direction.
            setPiece1Pos({ x: clampedX, y: clampedY }) // Save the new (possibly limited) position.
          }
        }}
      >
        {/* target slot */}
        <div className="target-slot"></div>

        {/* draggable piece */}
        <div
          className="piece"  // put the onMouseDown on the piece since dragging should start only when the piece is clicked, not the box.
          style={{ top: piece1Pos.y, left: piece1Pos.x }}

          onMouseDown={() => {  // start dragging (mouse button goes down)
            setIsDragging(true);
          }}
        ></div>

        {/* second static piece (we’ll remove or change later) */}
        <div className="piece piece-offset"
        ></div>
      </div>
    </div>
  )
}
export default App

