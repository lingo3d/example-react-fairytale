import {
  Joystick,
  Model,
  ThirdPersonCamera,
  World,
  usePreload,
  useWindowSize,
  Dummy,
  keyboard,
} from "lingo3d-react";
import { useRef, useEffect } from "react";
import "./App.css";

//Main game component that's rendered after loading is done
const Game = () => {
  //adjust FOV based on portrait or landscape orientation
  const windowSize = useWindowSize();
  const fov = windowSize.width > windowSize.height ? 90 : 120;

  //ref to the character model, used to imperatively move the character forward
  const characterRef = useRef();

  useEffect(() => {
    keyboard.onKeyPress = (_, keys) => {
      const character = characterRef.current;
      if (!character) return;

      if (keys.has("w")) character.strideForward = -5;
      else if (keys.has("s")) character.strideForward = 5;
      else character.strideForward = 0;

      if (keys.has("a")) character.strideRight = 5;
      else if (keys.has("d")) character.strideRight = -5;
      else character.strideRight = 0;
    };
  }, []);

  return (
    <World skybox="skybox.jpg">
      {/* map model */}
      <Model src="fairy.glb" scale={30} physics="map" />
      {/* camera and player character model */}
      <ThirdPersonCamera
        active
        mouseControl
        fov={fov}
        lockTargetRotation="dynamic-lock"
      >
        <Dummy
          ref={characterRef}
          src="person.glb"
          y={200}
          z={-150}
          physics="character"
          strideMove
        />
      </ThirdPersonCamera>
      {/* joystick */}
      {/* 摇杆 */}
      <Joystick
        onMove={(e) => {
          const character = characterRef.current;
          if (!character) return;

          character.strideForward = -e.y * 5;
          character.strideRight = -e.x * 5;
        }}
        onMoveEnd={() => {
          const character = characterRef.current;
          if (!character) return;

          character.strideForward = 0;
          character.strideRight = 0;
        }}
      />
    </World>
  );
};

const App = () => {
  //usePreload hook to preload assets, returns loading progress
  const progress = usePreload(
    ["fairy.glb", "person.glb", "skybox.jpg"],
    "21.2mb"
  );

  if (progress < 100)
    return <div className="loading">loading {Math.round(progress)}%</div>;

  return <Game />;
};

export default App;
