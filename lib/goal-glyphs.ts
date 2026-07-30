/**
 * Goal badge glyphs, extracted from the "Fifteen Goals" slide of the plan PDF.
 *
 * These are the deck's own vector paths on a 100x100 grid, stroked in
 * `currentColor` so a badge can recolour them and GSAP can draw them on.
 * Goals 12, 13 and 15 are raster in the source deck; they fall back to the
 * alpha-masked PNGs in `public/plan/goals/goal-NN-glyph.png`.
 *
 * Generated from the PDF — do not hand-edit; re-extract if the deck changes.
 */
import type { IconData } from "@/components/ui/icon"

export const GLYPH_VIEWBOX = "0 0 100 100"

export const GOAL_GLYPHS: Record<number, IconData | null> = {
  1: [
    ["path", { d: "M43.87,44.02 C43.87,40.69 46.56,38.00 49.89,38.00 C53.21,38.00 55.91,40.69 55.91,44.02", fill: "none", stroke: "currentColor", strokeWidth: 3.01, strokeLinecap: "round", strokeLinejoin: "round" }],
    ["path", { d: "M57.50,50.03 L42.28,50.03 C40.33,50.03 39.35,50.03 38.60,50.57 C37.85,51.11 37.51,52.05 36.83,53.94 L35.37,57.95 C34.03,61.65 33.36,63.50 34.23,64.79 C35.10,66.09 37.00,66.09 40.82,66.09 L58.95,66.09 C62.77,66.09 64.68,66.09 65.55,64.79 C66.42,63.50 65.75,61.65 64.41,57.95 L62.95,53.94 C62.27,52.05 61.92,51.11 61.17,50.57 C60.43,50.03 59.45,50.03 57.50,50.03 Z", fill: "none", stroke: "currentColor", strokeWidth: 3.01, strokeLinecap: "round", strokeLinejoin: "round" }],
    ["path", { d: "M49.89,50.03 L49.89,66.09", fill: "none", stroke: "currentColor", strokeWidth: 3.01, strokeLinecap: "round", strokeLinejoin: "round" }],
    ["path", { d: "M63.93,58.06 L35.84,58.06", fill: "none", stroke: "currentColor", strokeWidth: 3.01, strokeLinecap: "round", strokeLinejoin: "round" }],
    ["path", { d: "M49.89,66.09 L49.89,72.10 M49.89,72.10 L53.90,72.10 M49.89,72.10 L45.88,72.10", fill: "none", stroke: "currentColor", strokeWidth: 3.01, strokeLinecap: "round", strokeLinejoin: "round" }],
    ["path", { d: "M49.89,32.98 L49.89,31.98", fill: "none", stroke: "currentColor", strokeWidth: 3.01, strokeLinecap: "round", strokeLinejoin: "round" }],
    ["path", { d: "M60.92,44.02 L61.93,44.02", fill: "none", stroke: "currentColor", strokeWidth: 3.01, strokeLinecap: "round", strokeLinejoin: "round" }],
    ["path", { d: "M37.85,44.02 L38.85,44.02", fill: "none", stroke: "currentColor", strokeWidth: 3.01, strokeLinecap: "round", strokeLinejoin: "round" }],
    ["path", { d: "M57.69,36.21 L58.40,35.50", fill: "none", stroke: "currentColor", strokeWidth: 3.01, strokeLinecap: "round", strokeLinejoin: "round" }],
    ["path", { d: "M41.38,35.50 L42.09,36.21", fill: "none", stroke: "currentColor", strokeWidth: 3.01, strokeLinecap: "round", strokeLinejoin: "round" }],
  ],
  2: [
    ["path", { d: "M31.70,55.82 C31.70,47.43 38.89,39.13 43.93,34.34 C46.67,31.74 50.85,31.74 53.59,34.34 C58.63,39.13 65.81,47.43 65.81,55.82 C65.81,64.06 59.35,72.52 48.76,72.52 C38.16,72.52 31.70,64.06 31.70,55.82 Z", fill: "none", stroke: "currentColor", strokeWidth: 3.01, strokeLinecap: "round", strokeLinejoin: "round" }],
    ["path", { d: "M71.55,29.54 L71.55,26.75 C71.55,23.98 69.30,21.73 66.53,21.73 C63.76,21.73 61.51,23.98 61.51,26.75 L61.51,29.54", fill: "none", stroke: "currentColor", strokeWidth: 1.67, strokeLinecap: "round", strokeLinejoin: "round" }],
    ["path", { d: "M68.20,29.54 L64.86,29.54 C62.25,29.54 60.95,29.54 59.97,30.07 C59.19,30.48 58.55,31.12 58.13,31.90 C57.61,32.89 57.61,34.19 57.61,36.79 C57.61,39.40 57.61,40.70 58.13,41.69 C58.55,42.46 59.19,43.10 59.97,43.52 C60.95,44.04 62.25,44.04 64.86,44.04 L68.20,44.04 C70.81,44.04 72.11,44.04 73.10,43.52 C73.88,43.10 74.51,42.46 74.93,41.69 C75.46,40.70 75.46,39.40 75.46,36.79 C75.46,34.19 75.46,32.89 74.93,31.90 C74.51,31.12 73.88,30.48 73.10,30.07 C72.11,29.54 70.81,29.54 68.20,29.54 Z", fill: "none", stroke: "currentColor", strokeWidth: 1.67, strokeLinecap: "round", strokeLinejoin: "round" }],
    ["path", { d: "M68.76,36.79 C68.76,38.03 67.76,39.02 66.53,39.02 C65.30,39.02 64.30,38.03 64.30,36.79 C64.30,35.56 65.30,34.56 66.53,34.56 C67.76,34.56 68.76,35.56 68.76,36.79 Z", fill: "none", stroke: "currentColor", strokeWidth: 1.67, strokeLinecap: "round", strokeLinejoin: "round" }],
  ],
  3: [
    ["path", { d: "M55.78,45.73 L33.71,67.80", fill: "none", stroke: "currentColor", strokeWidth: 3.01, strokeLinecap: "round", strokeLinejoin: "round" }],
    ["path", { d: "M61.80,31.69 L55.78,37.71 C54.68,38.80 54.14,39.35 53.84,39.94 C53.29,41.06 53.29,42.38 53.84,43.50 C54.14,44.09 54.68,44.64 55.78,45.73 C56.87,46.83 57.42,47.37 58.01,47.67 C59.13,48.22 60.45,48.22 61.57,47.67 C62.16,47.37 62.71,46.83 63.80,45.73 L69.82,39.71", fill: "none", stroke: "currentColor", strokeWidth: 3.01, strokeLinecap: "round", strokeLinejoin: "round" }],
    ["path", { d: "M65.81,35.70 L59.79,41.72", fill: "none", stroke: "currentColor", strokeWidth: 3.01, strokeLinecap: "round", strokeLinejoin: "round" }],
    ["path", { d: "M43.43,45.42 C40.69,48.16 36.93,48.85 33.51,45.42 C30.09,42.00 28.29,35.76 31.03,33.02 C33.77,30.29 40.00,32.08 43.43,35.50 C46.85,38.93 46.17,42.68 43.43,45.42 Z M43.43,45.42 L65.81,67.80", fill: "none", stroke: "currentColor", strokeWidth: 3.01, strokeLinecap: "round", strokeLinejoin: "round" }],
  ],
  4: [
    ["path", { d: "M30.83,63.07 L30.83,54.82 C30.83,52.94 30.83,51.99 31.05,51.08 C31.26,50.17 31.68,49.33 32.53,47.64 L34.63,43.43 C35.71,41.27 36.25,40.19 37.22,39.59 C38.19,39.00 39.40,39.00 41.81,39.00 L55.97,39.00 C58.38,39.00 59.59,39.00 60.56,39.59 C61.53,40.19 62.07,41.27 63.14,43.43 L65.25,47.64 C66.09,49.33 66.52,50.17 66.73,51.08 C66.95,51.99 66.95,52.94 66.95,54.82 L66.95,63.07 C66.95,64.96 66.95,65.91 66.36,66.50 C65.77,67.08 64.82,67.08 62.93,67.08 C61.04,67.08 60.10,67.08 59.51,66.50 C58.92,65.91 58.92,64.96 58.92,63.07 L38.86,63.07 C38.86,64.96 38.86,65.91 38.27,66.50 C37.68,67.08 36.74,67.08 34.84,67.08 C32.95,67.08 32.01,67.08 31.42,66.50 C30.83,65.91 30.83,64.96 30.83,63.07 Z", fill: "none", stroke: "currentColor", strokeWidth: 3.01, strokeLinecap: "round", strokeLinejoin: "round" }],
    ["path", { d: "M66.95,51.03 L70.96,49.03", fill: "none", stroke: "currentColor", strokeWidth: 3.01, strokeLinecap: "round", strokeLinejoin: "round" }],
    ["path", { d: "M30.83,51.03 L26.82,49.03", fill: "none", stroke: "currentColor", strokeWidth: 3.01, strokeLinecap: "round", strokeLinejoin: "round" }],
    ["path", { d: "M30.83,51.03 L66.95,51.03", fill: "none", stroke: "currentColor", strokeWidth: 3.01, strokeLinecap: "round", strokeLinejoin: "round" }],
    ["path", { d: "M54.91,39.00 C54.91,36.16 54.91,34.74 54.03,33.86 C53.14,32.98 51.73,32.98 48.89,32.98 C46.05,32.98 44.63,32.98 43.75,33.86 C42.87,34.74 42.87,36.16 42.87,39.00", fill: "none", stroke: "currentColor", strokeWidth: 3.01, strokeLinecap: "round", strokeLinejoin: "round" }],
    ["path", { d: "M36.85,57.05 L38.86,57.05", fill: "none", stroke: "currentColor", strokeWidth: 3.01, strokeLinecap: "round", strokeLinejoin: "round" }],
    ["path", { d: "M58.92,57.05 L60.93,57.05", fill: "none", stroke: "currentColor", strokeWidth: 3.01, strokeLinecap: "round", strokeLinejoin: "round" }],
  ],
  5: [
    ["path", { d: "M29.83,66.37 L61.93,66.37", fill: "none", stroke: "currentColor", strokeWidth: 3.01, strokeLinecap: "round", strokeLinejoin: "round" }],
    ["path", { d: "M33.49,50.65 C32.94,50.25 32.43,49.75 31.83,47.99 C31.67,47.56 31.05,45.37 30.53,43.38 C30.09,41.69 29.69,40.16 29.88,39.77 C30.03,39.36 30.23,39.06 30.88,38.66 C31.28,38.41 33.34,37.91 33.74,37.81 C34.14,37.71 34.69,37.66 35.14,37.81 C35.99,37.96 37.75,40.52 38.20,40.82 C38.40,41.02 39.05,41.60 39.81,41.67 C40.36,41.72 40.91,41.57 41.51,41.32 C42.06,41.09 52.95,35.80 53.95,35.35 C62.13,31.94 68.07,37.55 68.97,38.75 C69.90,39.92 70.10,40.27 69.85,41.27 C69.53,42.32 68.65,42.52 68.15,42.67 C67.65,42.82 60.72,44.68 58.01,45.43 C57.42,45.63 57.13,46.01 57.06,46.09 C56.71,46.59 55.12,50.00 54.66,50.75 C54.35,51.55 53.50,52.56 52.40,52.96 C51.24,53.36 49.24,53.81 48.79,53.96 C48.33,54.11 47.28,54.41 46.93,54.31 C46.48,54.21 46.05,53.76 46.25,53.06 C46.45,52.35 46.83,50.40 46.88,50.10 C46.93,49.80 47.43,48.54 46.88,48.49 C46.78,48.34 45.73,48.79 44.17,49.14 C43.02,49.47 41.81,49.79 40.96,50.00 C37.70,50.95 35.93,51.20 35.54,51.20 C34.79,51.20 34.24,51.10 33.49,50.65 Z", fill: "none", stroke: "currentColor", strokeWidth: 3.01, strokeLinecap: "round", strokeLinejoin: "round" }],
  ],
  6: [
    ["path", { d: "M52.29,30.98 L30.22,41.01", fill: "none", stroke: "currentColor", strokeWidth: 3.01, strokeLinecap: "round", strokeLinejoin: "round" }],
    ["path", { d: "M50.28,32.98 L50.28,71.10 L40.25,71.10 C36.47,71.10 34.58,71.10 33.40,69.93 C32.23,68.75 32.23,66.86 32.23,63.08 L32.23,41.01", fill: "none", stroke: "currentColor", strokeWidth: 3.01, strokeLinecap: "round", strokeLinejoin: "round" }],
    ["path", { d: "M50.28,41.01 L70.35,51.04", fill: "none", stroke: "currentColor", strokeWidth: 3.01, strokeLinecap: "round", strokeLinejoin: "round" }],
    ["path", { d: "M46.27,71.10 L60.32,71.10 C64.10,71.10 65.99,71.10 67.17,69.93 C68.34,68.75 68.34,66.86 68.34,63.08 L68.34,50.04", fill: "none", stroke: "currentColor", strokeWidth: 3.01, strokeLinecap: "round", strokeLinejoin: "round" }],
    ["path", { d: "M62.32,47.03 L62.32,41.01", fill: "none", stroke: "currentColor", strokeWidth: 3.01, strokeLinecap: "round", strokeLinejoin: "round" }],
    ["path", { d: "M40.25,49.03 L42.26,49.03 M40.25,57.06 L42.26,57.06", fill: "none", stroke: "currentColor", strokeWidth: 3.01, strokeLinecap: "round", strokeLinejoin: "round" }],
    ["path", { d: "M58.31,55.05 L60.32,55.05", fill: "none", stroke: "currentColor", strokeWidth: 3.01, strokeLinecap: "round", strokeLinejoin: "round" }],
    ["path", { d: "M59.31,71.10 L59.31,63.08", fill: "none", stroke: "currentColor", strokeWidth: 3.01, strokeLinecap: "round", strokeLinejoin: "round" }],
  ],
  7: [
    ["path", { d: "M42.26,32.82 C41.65,32.55 40.97,32.40 40.26,32.40 C37.49,32.40 35.24,34.65 35.24,37.42 C35.24,39.06 36.03,40.52 37.25,41.43", fill: "none", stroke: "currentColor", strokeWidth: 3.01, strokeLinecap: "round", strokeLinejoin: "round" }],
    ["path", { d: "M31.98,58.49 C30.46,58.49 29.22,57.20 29.22,55.61 C29.22,52.38 32.56,49.16 38.25,48.54", fill: "none", stroke: "currentColor", strokeWidth: 3.01, strokeLinecap: "round", strokeLinejoin: "round" }],
    ["path", { d: "M56.31,32.82 C56.92,32.55 57.60,32.40 58.31,32.40 C61.08,32.40 63.33,34.65 63.33,37.42 C63.33,39.06 62.54,40.52 61.32,41.43", fill: "none", stroke: "currentColor", strokeWidth: 3.01, strokeLinecap: "round", strokeLinejoin: "round" }],
    ["path", { d: "M66.59,58.49 C68.11,58.49 69.35,57.20 69.35,55.61 C69.35,52.38 66.00,49.15 60.32,48.53", fill: "none", stroke: "currentColor", strokeWidth: 3.01, strokeLinecap: "round", strokeLinejoin: "round" }],
    ["path", { d: "M55.30,42.44 C55.30,45.76 52.61,48.45 49.28,48.45 C45.96,48.45 43.27,45.76 43.27,42.44 C43.27,39.11 45.96,36.42 49.28,36.42 C52.61,36.42 55.30,39.11 55.30,42.44 Z", fill: "none", stroke: "currentColor", strokeWidth: 3.01, strokeLinecap: "round", strokeLinejoin: "round" }],
    ["path", { d: "M49.28,54.47 C41.76,54.47 37.25,58.77 37.25,63.07 C37.25,64.97 38.59,66.51 40.26,66.51 L58.31,66.51 C59.97,66.51 61.32,64.97 61.32,63.07 C61.32,58.77 56.81,54.47 49.28,54.47 Z", fill: "none", stroke: "currentColor", strokeWidth: 3.01, strokeLinecap: "round", strokeLinejoin: "round" }],
  ],
  8: [
    ["path", { d: "M45.09,66.59 C39.43,62.36 28.22,52.68 28.22,43.98 C28.22,38.22 32.44,33.56 38.25,33.56 C41.26,33.56 44.27,34.56 48.28,38.57 C52.29,34.56 55.30,33.56 58.31,33.56 C64.11,33.56 68.34,38.22 68.34,43.98 C68.34,52.68 57.12,62.36 51.46,66.59 C49.56,68.01 46.99,68.01 45.09,66.59 Z", fill: "none", stroke: "currentColor", strokeWidth: 3.01, strokeLinecap: "round", strokeLinejoin: "round" }],
    ["path", { d: "M64.33,52.61 L56.36,52.61 C55.93,52.61 55.72,52.61 55.54,52.54 C55.44,52.50 55.34,52.44 55.26,52.38 C55.11,52.25 55.02,52.07 54.83,51.71 C54.28,50.66 54.00,50.14 53.61,50.01 C53.40,49.95 53.18,49.95 52.97,50.01 C52.58,50.14 52.31,50.66 51.76,51.71 L50.52,54.08 C49.57,55.90 49.09,56.80 48.42,56.75 C47.74,56.69 47.43,55.73 46.81,53.79 L45.87,50.90 C45.20,48.81 44.86,47.76 44.16,47.73 C43.47,47.69 43.01,48.69 42.11,50.70 L41.78,51.45 C41.53,52.01 41.40,52.30 41.15,52.45 C40.90,52.61 40.58,52.61 39.93,52.61 L32.23,52.61", fill: "none", stroke: "currentColor", strokeWidth: 3.01, strokeLinecap: "round", strokeLinejoin: "round" }],
  ],
  9: [
    ["path", { d: "M29.22,41.74 C29.22,44.44 45.46,51.78 49.26,51.78 C53.05,51.78 69.29,44.44 69.29,41.74 C69.29,39.05 53.05,31.71 49.26,31.71 C45.46,31.71 29.22,39.05 29.22,41.74 Z", fill: "none", stroke: "currentColor", strokeWidth: 3.01, strokeLinecap: "round", strokeLinejoin: "round" }],
    ["path", { d: "M37.23,47.76 L37.73,59.06 C37.74,59.28 37.76,59.51 37.83,59.73 C38.03,60.40 38.40,61.01 38.97,61.41 C43.43,64.61 55.08,64.61 59.54,61.41 C60.11,61.01 60.48,60.40 60.69,59.73 C60.75,59.51 60.78,59.28 60.79,59.06 L61.28,47.76", fill: "none", stroke: "currentColor", strokeWidth: 3.01, strokeLinecap: "round", strokeLinejoin: "round" }],
    ["path", { d: "M66.28,44.75 L66.28,58.80 M66.28,58.80 C64.70,61.70 63.99,63.25 63.28,65.82 C63.12,66.73 63.25,67.19 63.88,67.60 C64.13,67.77 64.44,67.83 64.74,67.83 L67.79,67.83 C68.12,67.83 68.45,67.76 68.71,67.57 C69.30,67.17 69.45,66.73 69.29,65.82 C68.66,63.44 67.87,61.81 66.28,58.80 Z", fill: "none", stroke: "currentColor", strokeWidth: 3.01, strokeLinecap: "round", strokeLinejoin: "round" }],
  ],
  10: [
    ["path", { d: "M55.30,49.31 C55.30,49.31 50.28,53.32 50.28,60.35", fill: "none", stroke: "currentColor", strokeWidth: 3.01, strokeLinecap: "round", strokeLinejoin: "round" }],
    ["path", { d: "M46.40,44.42 C48.90,41.91 48.90,37.85 46.40,35.34 C42.62,31.56 34.30,32.32 34.30,32.32 C34.30,32.32 33.54,40.64 37.32,44.42 C39.83,46.93 43.89,46.93 46.40,44.42 Z", fill: "none", stroke: "currentColor", strokeWidth: 3.01, strokeLinecap: "round", strokeLinejoin: "round" }],
    ["path", { d: "M55.91,48.70 C58.06,50.85 61.54,50.85 63.69,48.70 C66.93,45.46 66.28,38.33 66.28,38.33 C66.28,38.33 59.15,37.68 55.91,40.92 C53.76,43.07 53.76,46.55 55.91,48.70 Z", fill: "none", stroke: "currentColor", strokeWidth: 3.01, strokeLinecap: "round", strokeLinejoin: "round" }],
    ["path", { d: "M46.27,45.30 C46.27,45.30 50.28,50.31 50.28,60.34", fill: "none", stroke: "currentColor", strokeWidth: 3.01, strokeLinecap: "round", strokeLinejoin: "round" }],
    ["path", { d: "M68.34,68.37 C63.93,63.45 57.48,60.35 50.28,60.35 C43.09,60.35 36.64,63.45 32.23,68.37", fill: "none", stroke: "currentColor", strokeWidth: 3.01, strokeLinecap: "round", strokeLinejoin: "round" }],
  ],
  11: [
    ["path", { d: "M35.63,50.04 C35.63,42.47 35.63,38.69 37.98,36.34 C40.33,33.99 44.11,33.99 51.68,33.99 C59.25,33.99 63.03,33.99 65.38,36.34 C67.73,38.69 67.73,42.47 67.73,50.04 C67.73,57.61 67.73,61.39 65.38,63.74 C63.03,66.09 59.25,66.09 51.68,66.09 C44.11,66.09 40.33,66.09 37.98,63.74 C35.63,61.39 35.63,57.61 35.63,50.04 Z", fill: "none", stroke: "currentColor", strokeWidth: 3.01, strokeLinecap: "round", strokeLinejoin: "round" }],
    ["path", { d: "M43.12,58.60 C44.59,60.07 46.95,60.07 51.68,60.07 C53.26,60.07 54.58,60.07 55.69,60.02 L61.66,54.05 C61.71,52.95 61.71,51.63 61.71,50.04 C61.71,45.31 61.71,42.95 60.24,41.48 C58.77,40.01 56.41,40.01 51.68,40.01 C46.95,40.01 44.59,40.01 43.12,41.48 C41.65,42.95 41.65,45.31 41.65,50.04 C41.65,54.77 41.65,57.13 43.12,58.60 Z", fill: "none", stroke: "currentColor", strokeWidth: 3.01, strokeLinecap: "round", strokeLinejoin: "round" }],
    ["path", { d: "M43.65,29.98 L43.65,33.99 M59.71,29.98 L59.71,33.99 M51.68,29.98 L51.68,33.99 M43.65,66.09 L43.65,70.10 M51.68,66.09 L51.68,70.10 M59.71,66.09 L59.71,70.10 M71.74,58.07 L67.73,58.07 M35.63,42.02 L31.62,42.02 M35.63,58.07 L31.62,58.07 M35.63,50.04 L31.62,50.04 M71.74,42.02 L67.73,42.02 M71.74,50.04 L67.73,50.04", fill: "none", stroke: "currentColor", strokeWidth: 3.01, strokeLinecap: "round", strokeLinejoin: "round" }],
  ],
  12: null,
  13: null,
  14: [
    ["path", { d: "M44.66,33.29 C36.62,35.12 30.62,42.31 30.62,50.90 C30.62,51.93 30.70,52.93 30.87,53.91 M44.66,33.29 L38.64,30.84 M44.66,33.29 L42.65,38.86 M64.85,58.93 C66.06,56.51 66.73,53.79 66.73,50.90 C66.73,41.96 60.22,34.53 51.68,33.10 M64.85,58.93 L70.74,54.92 M64.85,58.93 L61.72,52.91 M33.66,60.93 C36.90,65.77 42.41,68.96 48.67,68.96 C53.30,68.96 57.52,67.22 60.71,64.36 M33.66,60.93 L40.65,60.93 M33.66,60.93 L33.66,67.96", fill: "none", stroke: "currentColor", strokeWidth: 3.01, strokeLinecap: "round", strokeLinejoin: "round" }],
  ],
  15: null,
}
