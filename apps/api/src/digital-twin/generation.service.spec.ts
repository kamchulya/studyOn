import { GenerationService } from "./generation.service";

function setup() {
  const twin = { id: "twin_1", sourcePhotoUrls: ["photo1"], sourceVoiceUrl: null };
  const createdJob = { id: "job_1" };

  const prisma = {
    generationJob: {
      create: jest.fn().mockResolvedValue(createdJob),
      update: jest.fn().mockImplementation(({ data }) => ({ id: "job_1", ...data })),
      findUnique: jest.fn().mockResolvedValue({ id: "job_1", userId: "user_1" }),
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
  const textProvider = {
    generate: jest.fn().mockResolvedValue({ status: "READY", resultText: "Черновик поста" }),
    checkStatus: jest.fn(),
  } as any;

  const service = new GenerationService(prisma, digitalTwin, imageProvider, videoProvider, textProvider);
  return { service, prisma, digitalTwin, imageProvider, videoProvider, textProvider };
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

  it("creates a TEXT job via the mock text provider without requiring a digital twin", async () => {
    const { service, textProvider, digitalTwin } = setup();
    const result = await service.create("user_1", "TEXT", "тема поста про утреннюю рутину");
    expect(digitalTwin.getOwnedOrThrow).not.toHaveBeenCalled();
    expect(textProvider.generate).toHaveBeenCalledWith({ prompt: "тема поста про утреннюю рутину" });
    expect(result.status).toBe("READY");
    expect(result.resultText).toBe("Черновик поста");
  });
});

describe("GenerationService.schedule/unschedule", () => {
  it("sets scheduledFor on the owned job", async () => {
    const { service, prisma } = setup();
    await service.schedule("user_1", "job_1", "2026-10-01T00:00:00.000Z");
    expect(prisma.generationJob.update).toHaveBeenCalledWith({
      where: { id: "job_1" },
      data: { scheduledFor: new Date("2026-10-01T00:00:00.000Z") },
    });
  });

  it("clears scheduledFor on unschedule", async () => {
    const { service, prisma } = setup();
    await service.unschedule("user_1", "job_1");
    expect(prisma.generationJob.update).toHaveBeenCalledWith({
      where: { id: "job_1" },
      data: { scheduledFor: null },
    });
  });

  it("throws when the job belongs to another user", async () => {
    const { service, prisma } = setup();
    prisma.generationJob.findUnique.mockResolvedValue({ id: "job_1", userId: "someone_else" });
    await expect(service.schedule("user_1", "job_1", "2026-10-01T00:00:00.000Z")).rejects.toThrow(
      "не найдена",
    );
  });
});
