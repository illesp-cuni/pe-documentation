(function () {
  "use strict";

  const SVG_NS = "http://www.w3.org/2000/svg";

  function initializeCombCalculator() {
    const tool = document.getElementById("comb-tool");

    if (!tool || tool.dataset.initialized === "true") {
      return;
    }

    tool.dataset.initialized = "true";

    const chainLengthInput =
      document.getElementById("comb-chain-length");

    const branchLengthInput =
      document.getElementById("comb-branch-length");

    const numberBranchesInput =
      document.getElementById("comb-number-branches");

    const firstAttachmentInput =
      document.getElementById("comb-first-attachment");

    const spacingInput =
      document.getElementById("comb-spacing");

    const generateButton =
      document.getElementById("generate-comb");

    const copyButton =
      document.getElementById("copy-comb");

    const parameterOutput =
      document.getElementById("comb-parameters");

    const errorOutput =
      document.getElementById("comb-error");

    const statusOutput =
      document.getElementById("comb-status");

    const svg =
      document.getElementById("comb-svg");

    if (
      !chainLengthInput ||
      !branchLengthInput ||
      !numberBranchesInput ||
      !firstAttachmentInput ||
      !spacingInput ||
      !generateButton ||
      !copyButton ||
      !parameterOutput ||
      !errorOutput ||
      !statusOutput ||
      !svg
    ) {
      return;
    }

    firstAttachmentInput.min = "0";

    function createSvgElement(name, attributes) {
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

    function clearSvg() {
      svg.replaceChildren();
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
      const chainLength =
        readInteger(
          chainLengthInput,
          "chain_length",
          2
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

      const firstAttachment =
        readInteger(
          firstAttachmentInput,
          "First attachment index",
          0
        );

      const spacing =
        readInteger(
          spacingInput,
          "Spacing",
          1
        );

      if (firstAttachment >= chainLength) {
        throw new Error(
          "The first attachment index must be between 0 and " +
          (chainLength - 1) +
          "."
        );
      }

      const mode =
        spacing * chainLength +
        firstAttachment;

      const totalBeads =
        chainLength +
        branchLength * numberOfBranches;

      if (totalBeads > 3000) {
        throw new Error(
          "This structure is too large for the browser preview."
        );
      }

      return {
        chainLength: chainLength,
        branchLength: branchLength,
        numberOfBranches: numberOfBranches,
        firstAttachment: firstAttachment,
        spacing: spacing,
        mode: mode,
        totalBeads: totalBeads
      };
    }

    function writeParameters(values) {
      parameterOutput.textContent = [
        "chain_length " + values.chainLength,
        "branch_length " + values.branchLength,
        "mode " + values.mode,
        "n_branches " + values.numberOfBranches
      ].join("\n");
    }

    function calculateAttachmentSites(values) {
      const sites = [];

      for (
        let branchIndex = 0;
        branchIndex < values.numberOfBranches;
        branchIndex++
      ) {
        const site =
          (
            values.firstAttachment +
            branchIndex * values.spacing
          ) %
          values.chainLength;

        sites.push(site);
      }

      return sites;
    }

    function drawLine(
      x1,
      y1,
      x2,
      y2,
      width
    ) {
      svg.appendChild(
        createSvgElement("line", {
          x1: x1,
          y1: y1,
          x2: x2,
          y2: y2,
          stroke: "#59636e",
          "stroke-width": width,
          "stroke-linecap": "round"
        })
      );
    }

    function drawCircle(
      x,
      y,
      radius,
      fill
    ) {
      svg.appendChild(
        createSvgElement("circle", {
          cx: x,
          cy: y,
          r: radius,
          fill: fill,
          stroke: "#20252b",
          "stroke-width": 1.5
        })
      );
    }

    function drawText(
      x,
      y,
      text,
      size
    ) {
      const label =
        createSvgElement("text", {
          x: x,
          y: y,
          fill: "#30363d",
          "font-size": size,
          "font-family": "monospace",
          "font-weight": "600",
          "text-anchor": "middle"
        });

      label.textContent = text;

      svg.appendChild(label);
    }

    function drawComb(values) {
      clearSvg();

      const attachmentSites =
        calculateAttachmentSites(values);

      const branchCounts =
        new Map();

      attachmentSites.forEach(function (site) {
        branchCounts.set(
          site,
          (branchCounts.get(site) || 0) + 1
        );
      });

      const usedCounts =
        new Map();

      const left = 60;
      const right = 60;
      const backboneY = 330;

      const availableWidth =
        1000 - left - right;

      const backboneStep =
        availableWidth /
        Math.max(
          1,
          values.chainLength - 1
        );

      const maximumBranchHeight =
        230;

      const branchStep =
        Math.min(
          36,
          maximumBranchHeight /
          Math.max(
            1,
            values.branchLength
          )
        );

      const backbonePositions = [];

      for (
        let beadIndex = 0;
        beadIndex < values.chainLength;
        beadIndex++
      ) {
        backbonePositions.push({
          x:
            left +
            beadIndex * backboneStep,

          y: backboneY
        });
      }

      for (
        let beadIndex = 0;
        beadIndex < values.chainLength - 1;
        beadIndex++
      ) {
        const current =
          backbonePositions[beadIndex];

        const next =
          backbonePositions[beadIndex + 1];

        drawLine(
          current.x,
          current.y,
          next.x,
          next.y,
          4
        );
      }

      attachmentSites.forEach(
        function (site) {
          const base =
            backbonePositions[site];

          const occurrence =
            usedCounts.get(site) || 0;

          usedCounts.set(
            site,
            occurrence + 1
          );

          const direction =
            occurrence % 2 === 0
              ? -1
              : 1;

          const pairIndex =
            Math.floor(
              occurrence / 2
            );

          const horizontalOffset =
            pairIndex === 0
              ? 0
              : (
                  pairIndex % 2 === 0
                    ? -1
                    : 1
                ) *
                Math.ceil(
                  pairIndex / 2
                ) *
                15;

          let previousX =
            base.x;

          let previousY =
            base.y;

          for (
            let branchBead = 0;
            branchBead < values.branchLength;
            branchBead++
          ) {
            const currentX =
              base.x +
              horizontalOffset;

            const currentY =
              backboneY +
              direction *
              branchStep *
              (branchBead + 1);

            drawLine(
              previousX,
              previousY,
              currentX,
              currentY,
              3
            );

            drawCircle(
              currentX,
              currentY,
              7,
              "#cfd8dc"
            );

            previousX =
              currentX;

            previousY =
              currentY;
          }
        }
      );

      backbonePositions.forEach(
        function (
          position,
          beadIndex
        ) {
          const isAttachmentSite =
            branchCounts.has(beadIndex);

          let fill =
            "#90caf9";

          let radius =
            8;

          if (beadIndex === 0) {
            fill =
              "#4169e1";

            radius =
              10;
          }

          if (isAttachmentSite) {
            fill =
              "#ef5350";

            radius =
              10;
          }

          drawCircle(
            position.x,
            position.y,
            radius,
            fill
          );

          /*
           * Only display indices of actual attachment sites.
           */
          if (isAttachmentSite) {
            drawText(
              position.x,
              position.y + 29,
              String(beadIndex),
              14
            );
          }
        }
      );

      return attachmentSites;
    }

    function generateScheme() {
      try {
        const values =
          readValues();

        writeParameters(values);

        const sites =
          drawComb(values);

        const uniqueSites =
          Array.from(
            new Set(sites)
          );

        errorOutput.textContent =
          "";

        statusOutput.textContent =
          "Attachment indices: " +
          sites.join(", ") +
          ". Unique attachment sites: " +
          uniqueSites.join(", ") +
          ". Total beads: " +
          values.totalBeads +
          ".";
      } catch (error) {
        clearSvg();

        parameterOutput.textContent =
          "Invalid input";

        errorOutput.textContent =
          error.message;

        statusOutput.textContent =
          "Could not generate the comb structure.";
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
      chainLengthInput,
      branchLengthInput,
      numberBranchesInput,
      firstAttachmentInput,
      spacingInput
    ].forEach(function (input) {
      input.addEventListener(
        "input",
        generateScheme
      );
    });

    generateScheme();
  }

  document.addEventListener(
    "DOMContentLoaded",
    initializeCombCalculator
  );

  if (typeof document$ !== "undefined") {
    document$.subscribe(
      initializeCombCalculator
    );
  }
})();