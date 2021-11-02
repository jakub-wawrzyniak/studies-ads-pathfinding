"use strict";

function PlusMinus({ state, setState, step }) {
  return (
    <span className="plusminus">
      <button onClick={() => setState(state + step)}>+</button>
      <button onClick={() => setState(state - step)}>-</button>
    </span>
  );
}

function ModeSelector({ mode, setMode }) {
  const change = () => {
    if (mode === "bidirect") setMode("salesman");
    else setMode("bidirect");
  };

  return (
    <div className="selector radio">
      <input
        type="radio"
        name="mode"
        id="bidirect"
        value="bidirect"
        onChange={change}
        checked={mode === "bidirect"}
      />
      <label htmlFor="bidirect">Bidirectional pathfinding</label>
      <input
        type="radio"
        name="mode"
        id="salesman"
        value="salesman"
        onChange={change}
        checked={mode === "salesman"}
      />
      <label htmlFor="salesman">Salesman problem</label>
    </div>
  );
}

function ConnectionModeSelector({ mode, setMode }) {
  const change = () => {
    if (mode === "nearest") setMode("random");
    else setMode("nearest");
  };

  return (
    <div className="selector radio">
      <input
        type="radio"
        name="connectionMode"
        id="nearest"
        value="nearest"
        onChange={change}
        checked={mode === "nearest"}
      />
      <label htmlFor="nearest">Connect nearest cities</label>
      <input
        type="radio"
        name="connectionMode"
        id="random"
        value="random"
        onChange={change}
        checked={mode === "random"}
      />
      <label htmlFor="random">Connect random cities</label>
    </div>
  );
}

function CityNoSelector({ cityNo, setCityNo }) {
  const handleChange = (val) => {
    val = parseInt(val);
    if (val < 2 || !val) val = 2;
    else if (val > 300) val = 300;
    setCityNo(val);
  };
  return (
    <div className="selector number">
      <label>
        Enter no of cities:
        <span>
          <input
            type="number"
            min="2"
            max="300"
            value={cityNo}
            onChange={(e) => handleChange(e.target.value)}
          />
          <PlusMinus state={cityNo} setState={handleChange} step={1} />
        </span>
      </label>
    </div>
  );
}

function RoadSelector({ roadFr, setRoadFr }) {
  const handleChange = (val) => {
    val = parseFloat(val);
    if (val < 0.05 || !val) val = 0.05;
    else if (val > 1) val = 1;
    setRoadFr(val);
  };
  return (
    <div className="selector number">
      <label>
        Enter fraction of roads:
        <span>
          <input
            type="number"
            min="0.05"
            max="1"
            step="0.01"
            value={roadFr}
            onChange={(e) => handleChange(e.target.value)}
          />
          <PlusMinus state={roadFr} setState={handleChange} step={0.01} />
        </span>
      </label>
    </div>
  );
}

function SolverSelector({ solver, setSolver }) {
  return (
    <div className="selector">
      <select onChange={(e) => setSolver(e.target.value)} value={solver}>
        <option value="bfs">breadth-first search</option>
        <option value="dfs">depth-first search</option>
        <option value="greedy">greedy search</option>
        <option value="mst">minimum spanning tree</option>
      </select>
    </div>
  );
}

function CitySelector({ cityNo, setCityNo, maxNo, prompt }) {
  const handleChange = (val) => {
    val = parseInt(val);
    if (val > maxNo) val = maxNo;
    if (val < 0 || !val) val = 0;
    setCityNo(val);
  };
  return (
    <div className="selector number">
      <label>
        Enter {prompt} city id:
        <span>
          <input
            type="number"
            min="0"
            max={maxNo}
            value={cityNo}
            onChange={(e) => handleChange(e.target.value)}
          />
          <PlusMinus setState={handleChange} state={cityNo} step={1} />
        </span>
      </label>
    </div>
  );
}

function ShowPathInfo({ path }) {
  if (path === -1)
    return (
      <React.Fragment>
        <h4>No path has been found. Please try:</h4>
        <ul>
          <li>selecting different endpoints</li>
          <li>increasing the fraction of roads</li>
          <li>lowering the no of cities</li>
        </ul>
      </React.Fragment>
    );

  return (
    <React.Fragment>
      <h4>Path details:</h4>
      <ul>
        <li>path length: {Math.ceil(path.dist)}</li>
        <li>nodes in path: {path.nodes.length}</li>
        <li>computation time: {path.calcTime}ms</li>
      </ul>
    </React.Fragment>
  );
}
