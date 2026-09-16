import { DigitalTwinService } from "./digital-twin.service";

describe("DigitalTwinService.createOrReplace", () => {
  function setup() {
    const prisma = {
      digitalTwin: {
        upsert: jest.fn().mockResolvedValue({ id: "twin_1" }),
      },
    } as any;
    const service = new DigitalTwinService(prisma);
    return { service, prisma };
  }

  it("rejects without explicit consent", async () => {
    const { service } = setup();
    await expect(service.createOrReplace("user_1", "false", ["url1"])).rejects.toThrow("согласие");
  });

  it("rejects when no photos are provided", async () => {
    const { service } = setup();
    await expect(service.createOrReplace("user_1", "true", [])).rejects.toThrow("хотя бы одно фото");
  });

  it("upserts the digital twin when consent is given and photos are present", async () => {
    const { service, prisma } = setup();
    await service.createOrReplace("user_1", "true", ["url1", "url2"], "voice-url");
    expect(prisma.digitalTwin.upsert).toHaveBeenCalledTimes(1);
    const call = prisma.digitalTwin.upsert.mock.calls[0][0];
    expect(call.create.sourcePhotoUrls).toEqual(["url1", "url2"]);
    expect(call.create.sourceVoiceUrl).toBe("voice-url");
    expect(call.create.consentGivenAt).toBeInstanceOf(Date);
  });
});
