const fs = require('fs');
const path = require('path');

const modules = ['fighter', 'event', 'bout', 'league', 'team', 'draft'];

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

modules.forEach(mod => {
    const dir = path.join('src/app/modules', mod);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    
    const Mod = capitalize(mod);

    // .interface.ts
    fs.writeFileSync(path.join(dir, `${mod}.interface.ts`), `export interface I${Mod} {}
`);

    // .validation.ts
    fs.writeFileSync(path.join(dir, `${mod}.validation.ts`), `import { z } from 'zod';

const create${Mod}ZodSchema = z.object({
  body: z.object({
    // Add validation fields here
  }),
});

const update${Mod}ZodSchema = z.object({
  body: z.object({
    // Add validation fields here
  }).deepPartial(),
});

export const ${Mod}Validation = {
  create${Mod}ZodSchema,
  update${Mod}ZodSchema,
};
`);

    // .service.ts
    fs.writeFileSync(path.join(dir, `${mod}.service.ts`), `import { Prisma } from '@prisma/client';

const create${Mod} = async (payload: any) => {
  return null;
};

const getAll${Mod} = async () => {
  return null;
};

const get${Mod}ById = async (id: string) => {
  return null;
};

const update${Mod} = async (id: string, payload: any) => {
  return null;
};

const delete${Mod} = async (id: string) => {
  return null;
};

export const ${Mod}Service = {
  create${Mod},
  getAll${Mod},
  get${Mod}ById,
  update${Mod},
  delete${Mod},
};
`);

    // .controller.ts
    fs.writeFileSync(path.join(dir, `${mod}.controller.ts`), `import { Request, Response } from 'express';
import catchAsync from '../../shared/catchAsync.js';
import sendResponse from '../../shared/sendResponse.js';
import { ${Mod}Service } from './${mod}.service.js';

const create${Mod} = catchAsync(async (req: Request, res: Response) => {
  const result = await ${Mod}Service.create${Mod}(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: '${Mod} created successfully',
    data: result,
  });
});

const getAll${Mod} = catchAsync(async (req: Request, res: Response) => {
  const result = await ${Mod}Service.getAll${Mod}();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: '${Mod}s retrieved successfully',
    data: result,
  });
});

const get${Mod}ById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ${Mod}Service.get${Mod}ById(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: '${Mod} retrieved successfully',
    data: result,
  });
});

const update${Mod} = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ${Mod}Service.update${Mod}(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: '${Mod} updated successfully',
    data: result,
  });
});

const delete${Mod} = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ${Mod}Service.delete${Mod}(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: '${Mod} deleted successfully',
    data: result,
  });
});

export const ${Mod}Controller = {
  create${Mod},
  getAll${Mod},
  get${Mod}ById,
  update${Mod},
  delete${Mod},
};
`);

    // .route.ts
    fs.writeFileSync(path.join(dir, `${mod}.route.ts`), `import express from 'express';
import { ${Mod}Controller } from './${mod}.controller.js';
import validateRequest from '../../middlewares/validateRequest.js';
import { ${Mod}Validation } from './${mod}.validation.js';

const router = express.Router();

router.post(
  '/',
  validateRequest(${Mod}Validation.create${Mod}ZodSchema),
  ${Mod}Controller.create${Mod}
);

router.get('/', ${Mod}Controller.getAll${Mod});
router.get('/:id', ${Mod}Controller.get${Mod}ById);

router.patch(
  '/:id',
  validateRequest(${Mod}Validation.update${Mod}ZodSchema),
  ${Mod}Controller.update${Mod}
);

router.delete('/:id', ${Mod}Controller.delete${Mod});

export const ${Mod}Router = router;
`);
});
