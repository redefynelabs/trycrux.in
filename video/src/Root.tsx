import { AbsoluteFill, Audio, Composition, Sequence, staticFile } from "remotion";
import { Close } from "./scenes/close";
import { Finance } from "./scenes/finance";
import { Intro } from "./scenes/intro";
import { Mei } from "./scenes/mei";
import { OneSystem } from "./scenes/one-system";
import { People } from "./scenes/people";
import { Problem } from "./scenes/problem";
import { Sales } from "./scenes/sales";
import { Ad30, AD30_FRAMES } from "./ad30";
import { RegionContext } from "./region";
import { FPS } from "./theme";
import type { CurrencyCode } from "../../src/lib/currency";
import { Backdrop } from "./ui";

/** The scenes in order, with how long each runs. Neighbours overlap by OVERLAP frames so one fades into the next. */
const SCENES = [
  { id: "intro", C: Intro, frames: 120 },
  { id: "problem", C: Problem, frames: 150 },
  { id: "one-system", C: OneSystem, frames: 150 },
  { id: "people", C: People, frames: 150 },
  { id: "sales", C: Sales, frames: 180 },
  { id: "finance", C: Finance, frames: 150 },
  { id: "mei", C: Mei, frames: 250 },
  { id: "close", C: Close, frames: 150 },
];
const OVERLAP = 10;
const TOTAL = SCENES.reduce((n, s) => n + s.frames, 0) - OVERLAP * (SCENES.length - 1);

/** One cut per region: the money and tax in the scenes follow `region` (npm run render makes all of them). */
function Hero({ region }: { region: CurrencyCode }) {
  let at = 0;
  return (
    <RegionContext.Provider value={region}>
    <AbsoluteFill>
      <Backdrop />
      {/* Music and effects cued to the scenes: sound/make_soundtrack.py writes it. */}
      <Audio src={staticFile("soundtrack.wav")} />
      {SCENES.map(({ id, C, frames }) => {
        const from = at;
        at += frames - OVERLAP;
        return (
          <Sequence key={id} name={id} from={from} durationInFrames={frames}>
            <C />
          </Sequence>
        );
      })}
    </AbsoluteFill>
    </RegionContext.Provider>
  );
}

export function Root() {
  return (
    <>
      <Composition id="Hero" component={Hero} defaultProps={{ region: "INR" as CurrencyCode }} durationInFrames={TOTAL} fps={FPS} width={1920} height={1080} />
      <Composition id="Ad30" component={Ad30} durationInFrames={AD30_FRAMES} fps={FPS} width={1080} height={1920} />
    </>
  );
}
