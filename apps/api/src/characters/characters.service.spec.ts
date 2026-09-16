import { CharactersService } from "./characters.service";
import { PlanCode } from "@studyon/shared";

function baseCharacter(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    id: "char_1",
    userId: "user_1",
    name: "Aidos",
    status: "DRAFT",
    bodyType: null,
    hairColor: null,
    hairLength: null,
    eyeColor: null,
    noseType: null,
    lipsType: null,
    facialHair: null,
    clothingStyle: null,
    previewImageUrl: null,
    voiceMode: null,
    voiceId: null,
    voicePrompt: null,
    nicheCategory: null,
    nicheSubcategory: null,
    nicheCustomText: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

describe("CharactersService.create", () => {
  function setup(activePlan: PlanCode | null, existingCount: number) {
    const prisma = {
      character: {
        count: jest.fn().mockResolvedValue(existingCount),
        create: jest.fn().mockResolvedValue(baseCharacter()),
      },
    } as any;
    const users = { getActivePlan: jest.fn().mockResolvedValue(activePlan) } as any;
    const imageProvider = { generatePreview: jest.fn() } as any;
    const service = new CharactersService(prisma, users, imageProvider);
    return { service, prisma };
  }

  it("rejects creation without an active subscription", async () => {
    const { service } = setup(null, 0);
    await expect(service.create("user_1", "Aidos")).rejects.toThrow(
      "Нужна активная подписка",
    );
  });

  it("allows creation within the plan's character limit", async () => {
    const { service, prisma } = setup(PlanCode.PRO, 2); // Pro allows 3
    await expect(service.create("user_1", "Aidos")).resolves.toBeDefined();
    expect(prisma.character.create).toHaveBeenCalledTimes(1);
  });

  it("rejects creation once the plan's character limit is reached", async () => {
    const { service, prisma } = setup(PlanCode.ENTRY, 1); // Entry allows 1
    await expect(service.create("user_1", "Aidos")).rejects.toThrow("лимит персонажей");
    expect(prisma.character.create).not.toHaveBeenCalled();
  });
});

describe("CharactersService.complete", () => {
  function setup(character: ReturnType<typeof baseCharacter>) {
    const prisma = {
      character: {
        findUnique: jest.fn().mockResolvedValue(character),
        update: jest.fn().mockImplementation(({ data }) => ({ ...character, ...data })),
      },
    } as any;
    const users = { getActivePlan: jest.fn() } as any;
    const imageProvider = { generatePreview: jest.fn() } as any;
    const service = new CharactersService(prisma, users, imageProvider);
    return { service };
  }

  it("rejects completion when a section is missing", async () => {
    const { service } = setup(baseCharacter({ nicheCategory: "fitness" }));
    await expect(service.complete("user_1", "char_1")).rejects.toThrow("Заполните все три раздела");
  });

  it("marks the character READY once all three sections are filled", async () => {
    const { service } = setup(
      baseCharacter({
        bodyType: "athletic",
        hairColor: "black",
        hairLength: "short",
        eyeColor: "brown",
        clothingStyle: "sportswear",
        voiceMode: "LIBRARY",
        voiceId: "nurlan",
        nicheCategory: "fitness",
      }),
    );
    const result = await service.complete("user_1", "char_1");
    expect(result.status).toBe("READY");
  });
});
