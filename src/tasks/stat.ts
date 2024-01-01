import { buy, create, Effect, itemAmount, print, use, useSkill } from "kolmafia";
import {
  $coinmaster,
  $effect,
  $effects,
  $item,
  $items,
  $skill,
  CommunityService,
  ensureEffect,
  get,
  have,
  uneffect,
  withChoice,
} from "libram";
import { Quest } from "../engine/task";
import { logTestSetup, tryAcquiringEffect } from "../lib";
import { forbiddenEffects } from "../resources";

export const HPQuest: Quest = {
  name: "HP",
  tasks: [
    {
      name: "Test",
      completed: () => CommunityService.HP.isDone(),
      prepare: (): void => {
        $effects`Ur-Kel's Aria of Annoyance, Aloysius' Antiphon of Aptitude, Ode to Booze`.forEach(
          (ef) => uneffect(ef)
        );
        const usefulEffects: Effect[] = [
          $effect`A Few Extra Pounds`,
          $effect`Big`,
          $effect`Hulkien`,
          $effect`Mariachi Mood`,
          $effect`Patience of the Tortoise`,
          $effect`Power Ballad of the Arrowsmith`,
          $effect`Quiet Determination`,
          $effect`Reptilian Fortitude`,
          $effect`Saucemastery`,
          $effect`Seal Clubbing Frenzy`,
          $effect`Song of Starch`,
          $effect`Stevedave's Shanty of Superiority`,
          $effect`Triple-Sized`,
        ];
        usefulEffects.forEach((ef) => tryAcquiringEffect(ef, true));
      },
      do: (): void => {
        const maxTurns = get("instant_hpTestTurnLimit", 1);
        const testTurns = CommunityService.HP.actualCost();
        if (testTurns > maxTurns) {
          print(`Expected to take ${testTurns}, which is more than ${maxTurns}.`, "red");
          print("Either there was a bug, or you are under-prepared for this test", "red");
          print("Manually complete the test if you think this is fine.", "red");
          print(
            "You may also increase the turn limit by typing 'set instant_hpTestTurnLimit=<new limit>'",
            "red"
          );
        }
        CommunityService.HP.run(() => logTestSetup(CommunityService.HP), maxTurns);
      },
      outfit: { modifier: "HP, switch disembodied hand, -switch left-hand man" },
      limit: { tries: 1 },
    },
  ],
};

export const MuscleQuest: Quest = {
  name: "Muscle",
  tasks: [
    {
      name: "Test",
      completed: () => CommunityService.Muscle.isDone(),
      prepare: (): void => {
        if (!have($effect`Expert Oiliness`) && !have($item`oil of expertise`)) {
          create($item`oil of expertise`, 1);
        }
        ensureEffect($effect`Expert Oiliness`);
        if (
          !have($effect`Phorcefullness`) &&
          !have($item`philter of phorce`) &&
          $items`scrumptious reagent, lemon`.every((it) => have(it))
        ) {
          create($item`philter of phorce`, 1);
        }
        const usefulEffects: Effect[] = [
          $effect`Big`,
          $effect`Go Get 'Em, Tiger!`,
          $effect`Hulkien`,
          $effect`Quiet Determination`,
          $effect`Power Ballad of the Arrowsmith`,
          $effect`Phorcefullness`,
          $effect`Rage of the Reindeer`,
          $effect`Song of Bravado`,
          $effect`Stevedave's Shanty of Superiority`,
          $effect`Triple-Sized`,
        ];
        usefulEffects.forEach((ef) => tryAcquiringEffect(ef, true));
      },
      do: (): void => {
        const maxTurns = get("instant_musTestTurnLimit", 2);
        const testTurns = CommunityService.Muscle.actualCost();
        if (testTurns > maxTurns) {
          print(`Expected to take ${testTurns}, which is more than ${maxTurns}.`, "red");
          print("Either there was a bug, or you are under-prepared for this test", "red");
          print("Manually complete the test if you think this is fine.", "red");
          print(
            "You may also increase the turn limit by typing 'set instant_musTestTurnLimit=<new limit>'",
            "red"
          );
        }
        CommunityService.Muscle.run(() => logTestSetup(CommunityService.Muscle), maxTurns);
      },
      outfit: { modifier: "Muscle, switch disembodied hand, -switch left-hand man" },
      post: (): void => {
        uneffect($effect`Power Ballad of the Arrowsmith`);
      },
      limit: { tries: 1 },
    },
  ],
};

export const MysticalityQuest: Quest = {
  name: "Mysticality",
  tasks: [
    {
      name: "Test",
      completed: () => CommunityService.Mysticality.isDone(),
      prepare: (): void => {
        const usefulEffects: Effect[] = [
          $effect`Big`,
          $effect`Glittering Eyelashes`,
          $effect`Hulkien`,
          $effect`The Magical Mojomuscular Melody`,
          $effect`Triple-Sized`,
          $effect`Pasta Oneness`,
          $effect`Quiet Judgement`,
          $effect`Saucemastery`,
          $effect`Song of Bravado`,
          $effect`Stevedave's Shanty of Superiority`,
        ];
        usefulEffects.forEach((ef) => tryAcquiringEffect(ef, true));
      },
      do: (): void => {
        const maxTurns = get("instant_mystTestTurnLimit", 1);
        const testTurns = CommunityService.Mysticality.actualCost();
        if (testTurns > maxTurns) {
          print(`Expected to take ${testTurns}, which is more than ${maxTurns}.`, "red");
          print("Either there was a bug, or you are under-prepared for this test", "red");
          print("Manually complete the test if you think this is fine.", "red");
          print(
            "You may also increase the turn limit by typing 'set instant_mystTestTurnLimit=<new limit>'",
            "red"
          );
        }
        CommunityService.Mysticality.run(
          () => logTestSetup(CommunityService.Mysticality),
          maxTurns
        );
      },
      outfit: { modifier: "Mysticality, switch disembodied hand, -switch left-hand man" },
      post: (): void => {
        uneffect($effect`The Magical Mojomuscular Melody`);
      },
      limit: { tries: 1 },
    },
  ],
};

export const MoxieQuest: Quest = {
  name: "Moxie",
  tasks: [
    {
      // This is also useful for the BoozeDrop test, but we can grab the +10%mox here first
      name: "High Heels",
      completed: () =>
        have($item`red-soled high heels`) ||
        !have($item`2002 Mr. Store Catalog`) ||
        get("availableMrStore2002Credits", 0) <= get("instant_saveCatalogCredits", 0) ||
        get("instant_skipHighHeels", false),
      do: (): void => {
        if (!have($item`Letter from Carrie Bradshaw`)) {
          buy($coinmaster`Mr. Store 2002`, 1, $item`Letter from Carrie Bradshaw`);
        }
        withChoice(1506, 3, () => use($item`Letter from Carrie Bradshaw`));
      },
      limit: { tries: 1 },
    },
    {
      name: "Loathing Idol Microphone Moxie",
      completed: () =>
        have($effect`Poppy Performance`) ||
        forbiddenEffects.includes($effect`Poppy Performance`) ||
        have($item`Loathing Idol Microphone (75% charged)`) ||
        have($item`Loathing Idol Microphone (50% charged)`),
      do: (): void => {
        if (!have($item`Loathing Idol Microphone`)) {
          buy($coinmaster`Mr. Store 2002`, 1, $item`Loathing Idol Microphone`);
        }
        withChoice(1505, 1, () => use($item`Loathing Idol Microphone`));
      },
      limit: { tries: 1 },
    },
    {
      name: "acquire & use rhinestone",
      completed: () =>
        //get("_acquireRhinestonesUsed", 0) < 1 ||
        $skill`Acquire Rhinestones`.dailylimit === 0,
      do: (): void => {
        if (!have($item`rhinestone`)) {
          useSkill($skill`Acquire Rhinestones`, 1);
        }
        if (have($item`rhinestone`)) {
          use($item`rhinestone`, itemAmount($item`rhinestone`));
        }
      },
      limit: { tries: 1 },
    },

    {
      name: "Test",
      completed: () => CommunityService.Moxie.isDone(),
      prepare: (): void => {
        if (!have($effect`Expert Oiliness`) && !have($item`oil of expertise`)) {
          create($item`oil of expertise`, 1);
        }
        ensureEffect($effect`Expert Oiliness`);
        const usefulEffects: Effect[] = [
          // $effect`Amazing`,
          $effect`Big`,
          $effect`Blessing of the Bird`,
          $effect`Blubbered Up`,
          $effect`Butt-Rock Hair`,
          $effect`Disco Fever`,
          $effect`Disco State of Mind`,
          $effect`Hulkien`,
          $effect`The Moxious Madrigal`,
          $effect`Triple-Sized`,
          $effect`Pomp & Circumsands`,
          $effect`Quiet Desperation`,
          $effect`Song of Bravado`,
          $effect`Stevedave's Shanty of Superiority`,
          $effect`Unrunnable Face`,
        ];
        usefulEffects.forEach((ef) => tryAcquiringEffect(ef, true));
      },
      do: (): void => {
        const maxTurns = get("instant_moxTestTurnLimit", 5);
        const testTurns = CommunityService.Moxie.actualCost();

        if (have($skill`Aug. 6th: Fresh Breath Day!`) && CommunityService.Moxie.actualCost() > 1) {
          tryAcquiringEffect($effect`Fresh Breath`);
        }

        if (testTurns > maxTurns) {
          print(`Expected to take ${testTurns}, which is more than ${maxTurns}.`, "red");
          print("Either there was a bug, or you are under-prepared for this test", "red");
          print("Manually complete the test if you think this is fine.", "red");
          print(
            "You may also increase the turn limit by typing 'set instant_moxTestTurnLimit=<new limit>'",
            "red"
          );
        }
        CommunityService.Moxie.run(() => logTestSetup(CommunityService.Moxie), maxTurns);
      },
      outfit: { modifier: "Moxie, switch disembodied hand, -switch left-hand man" },
      limit: { tries: 1 },
    },
  ],
};
