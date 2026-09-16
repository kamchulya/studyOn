import { GenerationService } from "./generation.service";

function setup() {
  const twin = { id: "twin_1", sourcePhotoUrls: ["photo1"], sourceVoiceUrl: null };
  const createdJob = { id: "job_1" };

  const prisma = {
    generationJob: {
      create: jest.fn().mockResolvedValue(createdJob),
      update: jest.fn().mockImplementation(({ data }) => ({ id: "job_1", ...data })),
      findUnique: jest.fn(),
    },
  } as any;

  const digitalTwin = { getOwnedOrThrow: jest.fn().mockResolvedValue(twin) } as any;
  const imageProvider = {
    generate: jest.fn().mockResolvedValue({ status: "READY", resultUrl: "photo1" }),
    checkStatus: jest.fn(),
  } as any;
  const videoProvider = {
    generate: jest.fn().mockResolvedValue({ status: "FAILED", errorMessage: "Видео-провайдер не подключён." }),
    checkStatus: jest.fn(),
  } as any;

  const service = new GenerationService(prisma, digitalTwin, imageProvider, videoProvider);
  return { service, prisma, digitalTwin, imageProvider, videoProvider };
}

describe("GenerationService.create", () => {
  it("creates a PHOTO job and marks it READY via the mock image provider", async () => {
    const { service, imageProvider } = setup();
    const result = await service.create("user_1", "PHOTO", "деловой костюм, макияж");
    expect(imageProvider.generate).toHaveBeenCalledWith({ sourcePhotoUrls: ["photo1"], prompt: "деловой костюм, макияж" });
    expect(result.status).toBe("READY");
    expect(result.resultUrl).toBe("photo1");
  });

  it("creates a VIDEO job and surfaces a clear error from the mock video provider", async () => {
    const { service, videoProvider } = setup();
    const result = await service.create("user_1", "VIDEO", "расскажи про автоматизацию");
    expect(videoProvider.generate).toHaveBeenCalledWith({
      sourcePhotoUrls: ["photo1"],
      sourceVoiceUrl: undefined,
      script: "расскажи про автоматизацию",
    });
    expect(result.status).toBe("FAILED");
    expect(result.errorMessage).toContain("не подключён");
  });

  it("throws when the user has no digital twin yet", async () => {
    const { service, digitalTwin } = setup();
    digitalTwin.getOwnedOrThrow.mockRejectedValue(new Error("Сначала загрузите фото и дайте согласие"));
    await expect(service.create("user_1", "PHOTO", "prompt")).rejects.toThrow("Сначала загрузите фото");
  });
});
