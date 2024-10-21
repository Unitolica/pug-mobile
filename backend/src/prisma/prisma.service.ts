import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();

    await this.createIfNotExistsRoot();
  }

  enableShutdownHooks(app: INestApplication) {
    process.on('beforeExit', async () => {
      await app.close();
    });
  }

  async createIfNotExistsRoot() {
    const root = await this.user.findFirst({
      where: {
        email: "root@root.com"
      }
    });

    if (root) {
      return "Root user already exists";
    }

    const create = await this.user.create({
      data: {
        email: "root@root.com",
        password: "$2b$04$iXEvdzBC0m6EQUmQ8KqpIeRwmQN.yaK0EhUq02bhwna84KcXswuoy", //root
      }
    });

    return create;
  }
}

