import { Test, TestingModule } from "@nestjs/testing";
import { BusinessValidationService } from "./businessValidation.service";

describe("BusinessValidationService", () => {
  let service: BusinessValidationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BusinessValidationService],
    }).compile();

    service = module.get<BusinessValidationService>(BusinessValidationService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  test("valid bussiness id and email", () => {
    expect(service.validateBusinessStep1("1234", "abc@gmail.com")).toBe(
      "good details",
    );
  });

  test("invalid email", () => {
    expect(service.validateBusinessStep1("1234", "abcgmail.com")).toBe(
      "Invalid email",
    );
  });
});
