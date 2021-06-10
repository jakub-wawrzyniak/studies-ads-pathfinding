'use strict';

function PlusMinus(_ref) {
    var state = _ref.state,
        setState = _ref.setState,
        step = _ref.step;

    return React.createElement(
        "span",
        { className: "plusminus" },
        React.createElement(
            "button",
            { onClick: function onClick() {
                    return setState(state + step);
                } },
            "+"
        ),
        React.createElement(
            "button",
            { onClick: function onClick() {
                    return setState(state - step);
                } },
            "-"
        )
    );
}

function ModeSelector(_ref2) {
    var mode = _ref2.mode,
        setMode = _ref2.setMode;

    var change = function change() {
        if (mode === "bidirect") setMode("salesman");else setMode("bidirect");
    };

    return React.createElement(
        "div",
        { className: "selector radio" },
        React.createElement("input", { type: "radio", name: "mode", id: "bidirect", value: "bidirect",
            onChange: change, checked: mode === "bidirect" }),
        React.createElement(
            "label",
            { htmlFor: "bidirect" },
            "Bidirectional pathfinding"
        ),
        React.createElement("input", { type: "radio", name: "mode", id: "salesman", value: "salesman",
            onChange: change, checked: mode === "salesman" }),
        React.createElement(
            "label",
            { htmlFor: "salesman" },
            "Salesman problem"
        )
    );
}

function ConnectionModeSelector(_ref3) {
    var mode = _ref3.mode,
        setMode = _ref3.setMode;

    var change = function change() {
        if (mode === "nearest") setMode("random");else setMode("nearest");
    };

    return React.createElement(
        "div",
        { className: "selector radio" },
        React.createElement("input", { type: "radio", name: "connectionMode", id: "nearest", value: "nearest",
            onChange: change, checked: mode === "nearest" }),
        React.createElement(
            "label",
            { htmlFor: "nearest" },
            "Connect nearest cities"
        ),
        React.createElement("input", { type: "radio", name: "connectionMode", id: "random", value: "random",
            onChange: change, checked: mode === "random" }),
        React.createElement(
            "label",
            { htmlFor: "random" },
            "Connect random cities"
        )
    );
}

function CityNoSelector(_ref4) {
    var cityNo = _ref4.cityNo,
        setCityNo = _ref4.setCityNo;

    var handleChange = function handleChange(val) {
        val = parseInt(val);
        if (val < 2 || !val) val = 2;else if (val > 300) val = 300;
        setCityNo(val);
    };
    return React.createElement(
        "div",
        { className: "selector number" },
        React.createElement(
            "label",
            null,
            "Enter no of cities:",
            React.createElement(
                "span",
                null,
                React.createElement("input", { type: "number", min: "2", max: "300",
                    value: cityNo, onChange: function onChange(e) {
                        return handleChange(e.target.value);
                    } }),
                React.createElement(PlusMinus, { state: cityNo, setState: handleChange, step: 1 })
            )
        )
    );
}

function RoadSelector(_ref5) {
    var roadFr = _ref5.roadFr,
        setRoadFr = _ref5.setRoadFr;

    var handleChange = function handleChange(val) {
        val = parseFloat(val);
        if (val < 0.05 || !val) val = 0.05;else if (val > 1) val = 1;
        setRoadFr(val);
    };
    return React.createElement(
        "div",
        { className: "selector number" },
        React.createElement(
            "label",
            null,
            "Enter fraction of roads:",
            React.createElement(
                "span",
                null,
                React.createElement("input", { type: "number", min: "0.05", max: "1", step: "0.01",
                    value: roadFr, onChange: function onChange(e) {
                        return handleChange(e.target.value);
                    } }),
                React.createElement(PlusMinus, { state: roadFr, setState: handleChange, step: 0.01 })
            )
        )
    );
}

function SolverSelector(_ref6) {
    var solver = _ref6.solver,
        setSolver = _ref6.setSolver;

    return React.createElement(
        "div",
        { className: "selector" },
        React.createElement(
            "select",
            { onChange: function onChange(e) {
                    return setSolver(e.target.value);
                }, value: solver },
            React.createElement(
                "option",
                { value: "bfs" },
                "breadth-first search"
            ),
            React.createElement(
                "option",
                { value: "dfs" },
                "depth-first search"
            ),
            React.createElement(
                "option",
                { value: "greedy" },
                "greedy search"
            ),
            React.createElement(
                "option",
                { value: "mst" },
                "minimum spanning tree"
            )
        )
    );
}

function CitySelector(_ref7) {
    var cityNo = _ref7.cityNo,
        setCityNo = _ref7.setCityNo,
        maxNo = _ref7.maxNo,
        prompt = _ref7.prompt;

    var handleChange = function handleChange(val) {
        val = parseInt(val);
        if (val > maxNo) val = maxNo;
        if (val < 0 || !val) val = 0;
        setCityNo(val);
    };
    return React.createElement(
        "div",
        { className: "selector number" },
        React.createElement(
            "label",
            null,
            "Enter ",
            prompt,
            " city id:",
            React.createElement(
                "span",
                null,
                React.createElement("input", { type: "number", min: "0", max: maxNo,
                    value: cityNo, onChange: function onChange(e) {
                        return handleChange(e.target.value);
                    } }),
                React.createElement(PlusMinus, { setState: handleChange, state: cityNo, step: 1 })
            )
        )
    );
}

function ShowPathInfo(_ref8) {
    var path = _ref8.path;

    if (path === -1) return React.createElement(
        React.Fragment,
        null,
        React.createElement(
            "h4",
            null,
            "No path has been found"
        ),
        React.createElement(
            "ul",
            null,
            React.createElement(
                "p",
                null,
                "Try selecting different endpoints or increasing the fraction of roads"
            )
        )
    );

    return React.createElement(
        React.Fragment,
        null,
        React.createElement(
            "h4",
            null,
            "Path details:"
        ),
        React.createElement(
            "ul",
            null,
            React.createElement(
                "li",
                null,
                "path length: ",
                Math.ceil(path.dist)
            ),
            React.createElement(
                "li",
                null,
                "nodes in path: ",
                path.nodes.length
            ),
            React.createElement(
                "li",
                null,
                "computation time: ",
                path.calcTime,
                "ms"
            )
        )
    );
}