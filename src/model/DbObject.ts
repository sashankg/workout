import z, { ZodFirstPartyTypeKind, ZodNever, util } from 'zod'
import truthy from '../util/truthy'

export class DbObject<T extends { key: z.ZodNumber }> extends z.ZodObject<T, 'strip', ZodNever> {
  constructor(schema: { key?: never } & Omit<T, 'key'>) {
    super({
      shape: () => ({
        ...schema,
        key: z.number(),
      }),
      typeName: ZodFirstPartyTypeKind.ZodObject,
      catchall: z.never(),
      unknownKeys: 'strip',
    })
    this.normalize = this.normalize.bind(this)
    this.__normalizeHelper = this.__normalizeHelper.bind(this)
    this.inputType = this.inputType.bind(this)
  }

  inputType() {
    return this.omit({ key: true })
  }

  normalize() {
    return this.__normalizeHelper(this)
  }

  private __normalizeHelper(schema: z.ZodType): z.ZodType {
    switch (true) {
      case this.__isSelf(schema):
      case schema instanceof z.ZodObject:
        return z.object(
          Object.entries(schema.shape)
            .map(([key, value]): [string, z.ZodType] | undefined => {
              return value instanceof z.ZodType ? [key, this.__normalizeHelper(value)] : undefined
            })
            .filter(truthy)
            .reduce((acc: Record<string, z.ZodType>, [key, value]) => {
              acc[key] = value
              return acc
            }, {})
        )
      case schema instanceof DbObject:
        return z.number()
      case schema instanceof z.ZodArray:
        return z.array(this.__normalizeHelper(schema.element))
      default:
        return schema
    }
  }

  private __isSelf(schema: z.ZodType): schema is DbObject<T> {
    return schema === this
  }
}
