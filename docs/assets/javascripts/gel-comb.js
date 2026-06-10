(function () {
  "use strict";

  const SVG_NS = "http://www.w3.org/2000/svg";
  const GEL_NODES = 8;
  const GEL_ARMS = 16;

  function svgElement(name, attributes) {
    const element =
      document.createElementNS(SVG_NS, name);

    Object.entries(attributes).forEach(function (entry) {
      element.setAttribute(
        entry[0],
        String(entry[1])
      );
    });

    return element;
  }

  function initializeGelComb() {
    const tool =
      document.getElementById("gel-comb-tool");

    if (!tool) {
      return false;
    }

    const armLengthInput =
      document.getElementById("gel-arm-length");

    const branchLengthInput =
      document.getElementById("gel-branch-length");

    const numberBranchesInput =
      document.getElementById("gel-number-branches");

    const spacingInput =
      document.getElementById("gel-graft-spacing");

    const generateButton =
      document.getElementById("generate-gel-comb");

    const copyButton =
      document.getElementById("copy-gel-comb");

    const parameterOutput =
      document.getElementById("gel-comb-parameters");

    const errorOutput =
      document.getElementById("gel-comb-error");

    const statusOutput =
      document.getElementById("gel-comb-status");

    const svg =
      document.getElementById("gel-comb-svg");

    if (
      !armLengthInput ||
      !branchLengthInput ||
      !numberBranchesInput ||
      !spacingInput ||
      !generateButton ||
      !copyButton ||
      !parameterOutput ||
      !errorOutput ||
      !statusOutput ||
      !svg
    ) {
      return false;
    }

    if (tool.dataset.initialized === "true") {
      return true;
    }

    tool.dataset.initialized = "true";

    function clearSvg() {
      while (svg.firstChild) {
        svg.removeChild(svg.firstChild);
      }

      svg.appendChild(
        svgElement("rect", {
          x: 0,
          y: 0,
          width: 1000,
          height: 760,
          fill: "#ffffff"
        })
      );
    }

    function drawLine(x1, y1, x2, y2, width, color) {
      svg.appendChild(
        svgElement("line", {
          x1: x1,
          y1: y1,
          x2: x2,
          y2: y2,
          stroke: color,
          "stroke-width": width,
          "stroke-linecap": "round"
        })
      );
    }

    function drawCircle(x, y, radius, fill) {
      svg.appendChild(
        svgElement("circle", {
          cx: x,
          cy: y,
          r: radius,
          fill: fill,
          stroke: "#263238",
          "stroke-width": 1.4
        })
      );
    }

    function drawText(
      x,
      y,
      text,
      size,
      anchor
    ) {
      const label =
        svgElement("text", {
          x: x,
          y: y,
          fill: "#263238",
          "font-size": size,
          "font-family": "monospace",
          "font-weight": "600",
          "text-anchor": anchor || "middle"
        });

      label.textContent = String(text);
      svg.appendChild(label);
    }

    function readInteger(input, name, minimum) {
      const value = Number(input.value);

      if (
        !Number.isInteger(value) ||
        value < minimum
      ) {
        throw new Error(
          name +
          " must be a whole number of at least " +
          minimum +
          "."
        );
      }

      return value;
    }

    function readValues() {
      const armLength =
        readInteger(
          armLengthInput,
          "Internal beads per arm",
          1
        );

      const branchLength =
        readInteger(
          branchLengthInput,
          "branch_length",
          1
        );

      const numberOfBranches =
        readInteger(
          numberBranchesInput,
          "n_branches",
          1
        );

      const spacing =
        readInteger(
          spacingInput,
          "Grafting step",
          1
        );

      const graftableBeads =
        GEL_ARMS * armLength;

      const chainLength =
        GEL_NODES + graftableBeads;

      const mode =
        spacing * graftableBeads;

      return {
        armLength: armLength,
        branchLength: branchLength,
        numberOfBranches: numberOfBranches,
        spacing: spacing,
        graftableBeads: graftableBeads,
        chainLength: chainLength,
        mode: mode,
        totalBeads:
          chainLength +
          branchLength * numberOfBranches
      };
    }

    function calculateAttachmentIndices(values) {
      const indices = [];
      let k = GEL_NODES;

      for (
        let i = 0;
        i < values.numberOfBranches;
        i++
      ) {
        k =
          GEL_NODES +
          (
            k -
            GEL_NODES +
            values.spacing
          ) %
          values.graftableBeads;

        indices.push(k);
      }

      return indices;
    }

    function drawPreview(values) {
      clearSvg();

      const attachmentIndices =
        calculateAttachmentIndices(values);

      const attachmentSet =
        new Set(attachmentIndices);

      const left = 150;
      const right = 70;
      const top = 45;
      const bottom = 45;

      const availableWidth =
        1000 - left - right;

      const availableHeight =
        760 - top - bottom;

      const rowSpacing =
        availableHeight /
        (GEL_ARMS - 1);

      const beadSpacing =
        values.armLength === 1
          ? 0
          : availableWidth /
            (values.armLength - 1);

      for (
        let arm = 0;
        arm < GEL_ARMS;
        arm++
      ) {
        const y =
          top + arm * rowSpacing;

        const firstIndex =
          GEL_NODES +
          arm * values.armLength;

        drawText(
          25,
          y + 5,
          "arm " + arm,
          13,
          "start"
        );

        if (values.armLength === 1) {
          const beadIndex =
            firstIndex;

          const x =
            left + availableWidth / 2;

          const attached =
            attachmentSet.has(beadIndex);

          drawCircle(
            x,
            y,
            attached ? 9 : 6,
            attached ? "#ef5350" : "#90caf9"
          );

          if (attached) {
            drawText(
              x,
              y - 14,
              beadIndex,
              12
            );
          }

          continue;
        }

        for (
          let bead = 0;
          bead < values.armLength - 1;
          bead++
        ) {
          const x1 =
            left + bead * beadSpacing;

          const x2 =
            left + (bead + 1) * beadSpacing;

          drawLine(
            x1,
            y,
            x2,
            y,
            3,
            "#78909c"
          );
        }

        for (
          let bead = 0;
          bead < values.armLength;
          bead++
        ) {
          const beadIndex =
            firstIndex + bead;

          const x =
            left + bead * beadSpacing;

          const attached =
            attachmentSet.has(beadIndex);

          drawCircle(
            x,
            y,
            attached ? 9 : 6,
            attached ? "#ef5350" : "#90caf9"
          );

          if (attached) {
            drawText(
              x,
              y - 14,
              beadIndex,
              12
            );
          }
        }
      }

      return attachmentIndices;
    }

    function generateScheme() {
      try {
        const values =
          readValues();

        parameterOutput.textContent = [
          "chains -1",
          "chain_length " + values.chainLength,
          "branch_length " + values.branchLength,
          "mode " + values.mode,
          "n_branches " + values.numberOfBranches
        ].join("\n");

        const indices =
          drawPreview(values);

        errorOutput.textContent = "";

        statusOutput.textContent =
          "Attachment indices: " +
          indices.join(", ") +
          ". Total beads: " +
          values.totalBeads +
          ".";
      } catch (error) {
        clearSvg();

        drawText(
          500,
          380,
          error.message,
          18
        );

        parameterOutput.textContent =
          "Invalid input";

        errorOutput.textContent =
          error.message;

        statusOutput.textContent =
          "Could not generate the preview.";
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

    [
      armLengthInput,
      branchLengthInput,
      numberBranchesInput,
      spacingInput
    ].forEach(function (input) {
      input.addEventListener(
        "input",
        generateScheme
      );
    });

    generateScheme();

    return true;
  }

  function tryInitialize() {
    if (initializeGelComb()) {
      return;
    }

    window.setTimeout(
      tryInitialize,
      100
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      tryInitialize
    );
  } else {
    tryInitialize();
  }

  if (
    typeof window.document$ !== "undefined" &&
    window.document$ &&
    typeof window.document$.subscribe === "function"
  ) {
    window.document$.subscribe(
      function () {
        window.setTimeout(
          tryInitialize,
          50
        );
      }
    );
  }
})();