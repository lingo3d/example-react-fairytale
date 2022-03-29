import { Joystick, Model, Skybox, ThirdPersonCamera, useKeyboard, useLoop, World, usePreload, useWindowSize } from "lingo3d-react"
import { useRef, useState } from "react"
import "./App.css"

//Main game component that's rendered after loading is done
const Game = () => {

  //useKeyboard hook will trigger re-render when the user presses keyboard
  const key = useKeyboard()

  //joystick coordinates
  const [joystick, setJoystick] = useState({ x: 0, y: 0, angle: 0 })

  //"running" becomes true when user presses "w" key, or pushes joystick forward
  const running = key === "w" || joystick.y < 0

  //ref to the character model, used to imperatively move the character forward
  const characterRef = useRef()

  //Callback passed to useLoop runs 60 times every second. When "running" is false, loop is paused automatically.
  useLoop(() => {
    characterRef.current.moveForward(-6)
  }, running)

  //adjust FOV based on portrait or landscape orientation
  const windowSize = useWindowSize()
  const fov = windowSize.width > windowSize.height ? 75 : 90

  return (
    <>
      <World>
        {/* map model */}
        <Model src="fairy.glb" scale={20} physics="map" />
        {/* camera and player character model */}
        <ThirdPersonCamera active mouseControl fov={fov}>
          <Model
            ref={characterRef}
            src="person.glb"
            y={200}
            z={-150}
            animations={{ idleAnimation: "idle.fbx", runningAnimation: "running.fbx" }}
            animation={ running ? "runningAnimation" : "idleAnimation" }
            physics="character"
          />
        </ThirdPersonCamera>
        <Skybox texture="skybox.jpg" />
      </World>
      <Joystick onMove={e => setJoystick({ x: e.x, y: e.y, angle: e.angle })} />
    </>
  )
}

const App = () => {
  //usePreload hook to preload assets, returns loading progress
  const progress = usePreload(["fairy.glb", "idle.fbx", "person.glb", "running.fbx", "skybox.jpg"], "21.2mb")

  if (progress < 100)
    return (
      <div className="loading">
        loading {Math.round(progress)}%
      </div>
    )

  return (
    <Game />
  )
}

export default App
