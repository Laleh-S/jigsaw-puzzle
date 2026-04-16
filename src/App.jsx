import { useState, useRef } from "react"

import click from "./assets/click.mp3"
import "./App.css"

// const clickSound = new Audio(click) 

function App() {
  // initial state: the value you pass into useState(...) once at the beginning. { x: 0, y: 0 }
  // current state (piece1Pos): whatever the latest value is on this render.
  // next state: whatever you pass into setPiece1Pos(...) 
  // setPiece1Pos is the function that allows you make these changes

  const [pieces, setPieces] = useState([  // Position lives here
    { id: 1, x: 0, y: 0 },
    { id: 2, x: 10, y: 10 },
  ]) 
  const [isDragging, setIsDragging] = useState(false)  // On and off switch for dragging
  
  const targetPos = { x: 200, y: 200 }
  const startPos = { x: 0, y: 0 }
  
  // Create a ref object that does not get reset between renders
  const clickSoundRef = useRef(null) // Initially, .current is set to null

  // Check if we have NOT created the audio object yet
  if (clickSoundRef.current === null) {

  // On the first render: .current is null, so this condition is true

  // Create a new Audio object and store it in .current
  // Now .current is no longer null
  clickSoundRef.current = new Audio(click)
}
// On future renders: .current already holds the Audio object So the condition is false, and we DO NOT create a new one


  function clamp(value, min, max) {  // guarantees the result is always between min and max
    if (value < min) return min // if too small return min
    if (value > max) return max // if too big return max
    return value // if in the middle return value unchanged
  }

  return (
    <div className="app">
      <h1>Jigsaw Puzzle</h1>
      <button
        onClick={() => {
          setIsDragging(false)
          setPieces([
            // ...pieces[0] means: copy all fields from the first piece object (for example: { id: 1, x: 0, y: 0 })
            { ...pieces[0], x: startPos.x, y: startPos.y }, 
            pieces[1], // stays unchanged
          ])
        }}
      >
        Reset
      </button>
      <div
        className="piece-container"

        onMouseUp={() => {  // stop dragging (mouse button comes up)
          if (!isDragging) return  //  if not dragging, skip everything below like playing sound, check distance or snap and do nothing.

          setIsDragging(false)

          // Measure how far the piece is from the target (left/right) or (up/down)
          const distanceX = Math.abs(pieces[0].x - targetPos.x)
          const distanceY = Math.abs(pieces[0].y - targetPos.y)
          
          // if it’s “close enough” (within 20 pixels in both directions)
          if (distanceX < 20 && distanceY < 20) {
            // if yes, snap it perfectly into place
            setPieces([
              { ...pieces[0], x: targetPos.x, y: targetPos.y },
              pieces[1],
            ])
            clickSoundRef.current?.play()
          }
        }}

        // between onMouseDown and onMouseUp moments, while isDragging is true, onMouseMove updates the piece position so it follows the mouse.
        onMouseMove={(event) => {
          // console.log(event)
          if (isDragging) { // only if we are draging do the followings
            // 220 value comes from the piece-container minus piece 
            const nextX = pieces[0].x + event.movementX // Take the current x position of the piece. Add how far the mouse just moved left/right. This is where the piece wants to go next horizontally.
            const nextY = pieces[0].y + event.movementY // Same idea for y (up/down).
            const clampedX = clamp(nextX, 0, 220) // If nextX is less than 0, use 0. If nextX is more than 220, use 220. Otherwise use nextX. → keeps the piece inside horizontally.
            const clampedY = clamp(nextY, 0, 220) // Same, but for the vertical direction.
            setPieces([
              { ...pieces[0], x: clampedX, y: clampedY },
              pieces[1],
            ])
          }
        }}
      >
        {/* target slot */}
        <div className="target-slot"></div>

        {/* draggable piece */}
        <div
          className="piece"  // put the onMouseDown on the piece since dragging should start only when the piece is clicked, not the box.
          style={{ top: pieces[0].y, left: pieces[0].x  }}

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
