import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { PrismaModule } from "./prisma/prisma.module";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { PlansModule } from "./plans/plans.module";
import { TokensModule } from "./tokens/tokens.module";
import { BillingModule } from "./billing/billing.module";
import { CharactersModule } from "./characters/characters.module";
import { DigitalTwinModule } from "./digital-twin/digital-twin.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ["../../.env", ".env"] }),
    ServeStaticModule.forRoot({ rootPath: join(__dirname, "..", "uploads"), serveRoot: "/uploads" }),
    PrismaModule,
    UsersModule,
    AuthModule,
    PlansModule,
    TokensModule,
    BillingModule,
    CharactersModule,
    DigitalTwinModule,
  ],
})
export class AppModule {}
