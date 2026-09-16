"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CharacterDto, VoiceOption } from "@studyon/shared";
import { AppearanceStep } from "./AppearanceStep";
import { VoiceStep } from "./VoiceStep";
import { NicheStep } from "./NicheStep";

const STEPS = ["Внешность", "Голос", "Ниша"];

export function CharacterWizard({
  initialCharacter,
  voices,
}: {
  initialCharacter: CharacterDto;
  voices: VoiceOption[];
}) {
  const router = useRouter();
  const [character, setCharacter] = useState(initialCharacter);
  const [step, setStep] = useState(0);

  return (
    <div>
      <ol className="mb-8 flex gap-4 text-sm">
        {STEPS.map((label, i) => (
          <li key={label} className={i === step ? "font-semibold text-brand" : "text-slate-500"}>
            {i + 1}. {label}
          </li>
        ))}
      </ol>

      {step === 0 && (
        <AppearanceStep
          character={character}
          onSaved={(updated) => {
            setCharacter(updated);
            setStep(1);
          }}
        />
      )}

      {step === 1 && (
        <VoiceStep
          character={character}
          voices={voices}
          onBack={() => setStep(0)}
          onSaved={(updated) => {
            setCharacter(updated);
            setStep(2);
          }}
        />
      )}

      {step === 2 && (
        <NicheStep
          character={character}
          onBack={() => setStep(1)}
          onCompleted={(updated) => {
            setCharacter(updated);
            router.push(`/characters/${updated.id}`);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
