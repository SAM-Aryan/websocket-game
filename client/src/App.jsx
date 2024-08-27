import { createSignal } from "solid-js";

function App() {
  let board = [
    ["A-P1", "A-P2", "A-H1", "A-H2", "A-P3"],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["B-P1", "B-P2", "B-H1", "B-H2", "B-P3"],
  ];

  let [player, setPlayer] = createSignal("A")

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div>Current Player: {player()}</div>
      <div className="flex flex-col">
        {board.map((row, i) => (
          <div key={i} className="flex">
            {row.map((col, j) => (
              <div
                key={j}
                className="w-20 h-20 border m-4 flex justify-center items-center hover:bg-blue-300 focus:bg-blue-700"
                tabIndex="0"
              >
                {col}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div></div>
    </div>
  );
}

export default App;