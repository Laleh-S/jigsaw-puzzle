import { useState } from "react"

import "./App.css"

function App() {
  // Initial state: the value you pass into useState(...) once at the beginning. { x: 0, y: 0 }
  // Current state (piece1Pos): whatever the latest value is on this render.
  // Next state: whatever you pass into setPiece1Pos(...) 
  // setPiece1Pos is the function that allows you make these changes
  
  const [piece1Pos, setPiece1Pos] = useState({x: 0, y: 0}) // Position lives here
  const [isDragging, setIsDragging] = useState(false)  // On and off switch for dragging
  function clamp (value, min, max) {  // guarantees the result is always between min and max
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
          setIsDragging(false);
        }}
        // Between onMouseDown and onMouseUp moments, while isDragging is true, onMouseMove updates the piece position so it follows the mouse.
        onMouseMove={(event) => {
          console.log(event)
          if (isDragging) { // only if we are draging do the followings
            // 220 value comes from container size - piece size = 320 - 100 = 220.
            const nextX = piece1Pos.x + event.movementX // Take the current x position of the piece. Add how far the mouse just moved left/right. This is where the piece wants to go next horizontally.
            const nextY = piece1Pos.y + event.movementY // Same idea for y (up/down).
            const clampedX = clamp(nextX, 0, 220) // If nextX is less than 0, use 0. If nextX is more than 220, use 220. Otherwise use nextX. → keeps the piece inside horizontally.
            const clampedY = clamp(nextY, 0, 220) // Same, but for the vertical direction.
            setPiece1Pos({ x: clampedX, y: clampedY }) // Save the new (possibly limited) position.
          }
        }}
      >
        <div
          // Put the onMouseDown on the piece since dragging should start only when the piece is clicked, not the box.
          className="piece"
          style={{ top: piece1Pos.y, left: piece1Pos.x }}
          onMouseDown={() => {  // start dragging (mouse button goes down)
            setIsDragging(true);
          }}
        ></div>
        <div className="piece piece-offset"
        ></div>
      </div>
    </div>
  )
}
export default App

