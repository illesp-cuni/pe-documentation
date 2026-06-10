
document.addEventListener("DOMContentLoaded", function () {
  const chainLengthInput =
    document.getElementById("chain-length");

  const branchingFactorInput =
    document.getElementById("branching-factor");

  const generationsInput =
    document.getElementById("generations");

  const generateButton =
    document.getElementById("generate-dendrimer");

  const copyButton =
    document.getElementById("copy-dendrimer");

  const parameterOutput =
    document.getElementById("dendrimer-parameters");

  const errorOutput =
    document.getElementById("dendrimer-error");

  const statusOutput =
    document.getElementById("dendrimer-status");

  const svg =
    document.getElementById("dendrimer-svg");

  if (
    !chainLengthInput ||
    !branchingFactorInput ||
    !generationsInput ||
    !generateButton ||
    !copyButton ||
    !parameterOutput ||
    !errorOutput ||
    !statusOutput ||
    !svg
  ) {
    return;
  }

  const SVG_NAMESPACE =
    "http://www.w3.org/2000/svg";

  function createSvgElement(name, attributes) {
    const element =
      document.createElementNS(
        SVG_NAMESPACE,
        name
      );

    Object.entries(attributes).forEach(
      function (entry) {
        element.setAttribute(
          entry[0],
          String(entry[1])
        );
      }
    );

    return element;
  }

  function clearSvg() {
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }
  }

  function calculateNumberOfBranches(
    branchingFactor,
    generations
  ) {
    let total =
      branchingFactor * branchingFactor +
      2 * branchingFactor;

    for (
      let generation = 2;
      generation <= generations;
      generation++
    ) {
      total +=
        Math.pow(
          branchingFactor,
          generation + 1
        ) +
        Math.pow(
          branchingFactor,
          generation
        );
    }

    return total;
  }

  function readValues() {
    const chainLength =
      Number(chainLengthInput.value);

    const branchingFactor =
      Number(branchingFactorInput.value);

    const generations =
      Number(generationsInput.value);

    if (
      !Number.isInteger(chainLength) ||
      chainLength < 2
    ) {
      throw new Error(
        "chain_length must be a whole number of at least 2."
      );
    }

    if (
      !Number.isInteger(branchingFactor) ||
      branchingFactor < 1
    ) {
      throw new Error(
        "The branching factor must be a positive whole number."
      );
    }

    if (
      !Number.isInteger(generations) ||
      generations < 1
    ) {
      throw new Error(
        "Generations must be a positive whole number."
      );
    }

    const branchLength =
      chainLength - 1;

    const mode =
      -10 * branchingFactor;

    const numberOfBranches =
      calculateNumberOfBranches(
        branchingFactor,
        generations
      );

    const totalBeads =
      chainLength +
      branchLength * numberOfBranches;

    if (
      numberOfBranches > 300 ||
      totalBeads > 2500
    ) {
      throw new Error(
        "This structure is too large for the browser preview."
      );
    }

    return {
      chainLength: chainLength,
      branchLength: branchLength,
      branchingFactor: branchingFactor,
      generations: generations,
      mode: mode,
      numberOfBranches: numberOfBranches,
      totalBeads: totalBeads
    };
  }

  function writeParameters(values) {
    parameterOutput.textContent = [
      "chain_length " +
        values.chainLength,

      "branch_length " +
        values.branchLength,

      "mode " +
        values.mode,

      "n_branches " +
        values.numberOfBranches
    ].join("\n");
  }

  function buildGraph(values) {
    const nodes = [];
    const edges = [];

    for (
      let index = 0;
      index < values.chainLength;
      index++
    ) {
      nodes.push({
        id: index,
        parent:
          index === 0
            ? null
            : index - 1,
        type:
          index === 0
            ? "root"
            : "backbone"
      });

      if (index > 0) {
        edges.push({
          source: index - 1,
          target: index
        });
      }
    }

    let nextIndex =
      values.chainLength;

    let attachmentSite = 0;

    for (
      let branchIndex = 0;
      branchIndex <
        values.numberOfBranches;
      branchIndex++
    ) {
      let previousNode =
        attachmentSite;

      for (
        let beadIndex = 0;
        beadIndex <
          values.branchLength;
        beadIndex++
      ) {
        const currentNode =
          nextIndex;

        nextIndex++;

        nodes.push({
          id: currentNode,
          parent: previousNode,
          type: "branch"
        });

        edges.push({
          source: previousNode,
          target: currentNode
        });

        previousNode =
          currentNode;
      }

      if (
        (branchIndex + 1) %
          values.branchingFactor ===
        0
      ) {
        attachmentSite +=
          values.branchLength;
      }
    }

    return {
      nodes: nodes,
      edges: edges
    };
  }

  function calculateLayout(nodes) {
    const children = new Map();

    nodes.forEach(function (node) {
      children.set(
        node.id,
        []
      );
    });

    nodes.forEach(function (node) {
      if (node.parent !== null) {
        children
          .get(node.parent)
          .push(node.id);
      }
    });

    const rawPositions =
      new Map();

    let nextLeafX = 0;

    function placeNode(
      nodeId,
      depth
    ) {
      const nodeChildren =
        children.get(nodeId) || [];

      if (
        nodeChildren.length === 0
      ) {
        const x =
          nextLeafX;

        nextLeafX++;

        rawPositions.set(
          nodeId,
          {
            x: x,
            y: depth
          }
        );

        return x;
      }

      const childPositions =
        nodeChildren.map(
          function (childId) {
            return placeNode(
              childId,
              depth + 1
            );
          }
        );

      const sum =
        childPositions.reduce(
          function (
            total,
            value
          ) {
            return total + value;
          },
          0
        );

      const x =
        sum /
        childPositions.length;

      rawPositions.set(
        nodeId,
        {
          x: x,
          y: depth
        }
      );

      return x;
    }

    placeNode(0, 0);

    const rawValues =
      Array.from(
        rawPositions.values()
      );

    const maximumX =
      Math.max.apply(
        null,
        rawValues.map(
          function (position) {
            return position.x;
          }
        )
      );

    const maximumY =
      Math.max.apply(
        null,
        rawValues.map(
          function (position) {
            return position.y;
          }
        )
      );

    const positions =
      new Map();

    rawPositions.forEach(
      function (
        position,
        nodeId
      ) {
        positions.set(
          nodeId,
          {
            x:
              50 +
              (
                position.x /
                Math.max(
                  1,
                  maximumX
                )
              ) *
                800,

            y:
              50 +
              (
                position.y /
                Math.max(
                  1,
                  maximumY
                )
              ) *
                550
          }
        );
      }
    );

    return positions;
  }

  function drawGraph(
    graph,
    positions
  ) {
    clearSvg();

    graph.edges.forEach(
      function (edge) {
        const source =
          positions.get(
            edge.source
          );

        const target =
          positions.get(
            edge.target
          );

        if (
          !source ||
          !target
        ) {
          return;
        }

        const line =
          createSvgElement(
            "line",
            {
              x1: source.x,
              y1: source.y,
              x2: target.x,
              y2: target.y,
              stroke: "#666666",
              "stroke-width": 3,
              "stroke-linecap":
                "round"
            }
          );

        svg.appendChild(line);
      }
    );

    graph.nodes.forEach(
      function (node) {
        const position =
          positions.get(
            node.id
          );

        if (!position) {
          return;
        }

        let fill =
          "#d3d3d3";

        let radius = 6;

        if (
          node.type === "root"
        ) {
          fill =
            "#4169e1";

          radius = 10;
        } else if (
          node.type ===
          "backbone"
        ) {
          fill =
            "#87ceeb";

          radius = 7;
        }

        const circle =
          createSvgElement(
            "circle",
            {
              cx: position.x,
              cy: position.y,
              r: radius,
              fill: fill,
              stroke: "#222222",
              "stroke-width": 1.5
            }
          );

        svg.appendChild(circle);
      }
    );
  }

  function generateScheme() {
    try {
      const values =
        readValues();

      writeParameters(values);

      errorOutput.textContent =
        "";

      const graph =
        buildGraph(values);

      const positions =
        calculateLayout(
          graph.nodes
        );

      drawGraph(
        graph,
        positions
      );

      statusOutput.textContent =
        "Generated static scheme: " +
        values.numberOfBranches +
        " branches and " +
        values.totalBeads +
        " beads.";
    } catch (error) {
      clearSvg();

      parameterOutput.textContent =
        "Invalid input";

      errorOutput.textContent =
        error.message;

      statusOutput.textContent =
        "Could not generate the structure.";
    }
  }

  function copyParameters() {
    const text =
      parameterOutput.textContent;

    if (
      !text ||
      text === "—" ||
      text === "Invalid input"
    ) {
      return;
    }

    navigator.clipboard
      .writeText(text)
      .then(function () {
        statusOutput.textContent =
          "Parameters copied.";
      })
      .catch(function () {
        statusOutput.textContent =
          "Select and copy the parameters manually.";
      });
  }

  generateButton.addEventListener(
    "click",
    generateScheme
  );

  copyButton.addEventListener(
    "click",
    copyParameters
  );

  chainLengthInput.addEventListener(
    "change",
    generateScheme
  );

  branchingFactorInput.addEventListener(
    "change",
    generateScheme
  );

  generationsInput.addEventListener(
    "change",
    generateScheme
  );

  generateScheme();
});

