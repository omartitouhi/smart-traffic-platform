
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model TrafficZone
 * 
 */
export type TrafficZone = $Result.DefaultSelection<Prisma.$TrafficZonePayload>

/**
 * Enums
 */
export namespace $Enums {
  export const CongestionLevel: {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH'
};

export type CongestionLevel = (typeof CongestionLevel)[keyof typeof CongestionLevel]

}

export type CongestionLevel = $Enums.CongestionLevel

export const CongestionLevel: typeof $Enums.CongestionLevel

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more TrafficZones
 * const trafficZones = await prisma.trafficZone.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more TrafficZones
   * const trafficZones = await prisma.trafficZone.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.trafficZone`: Exposes CRUD operations for the **TrafficZone** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TrafficZones
    * const trafficZones = await prisma.trafficZone.findMany()
    * ```
    */
  get trafficZone(): Prisma.TrafficZoneDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.8.0
   * Query Engine version: 3c6e192761c0362d496ed980de936e2f3cebcd3a
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    TrafficZone: 'TrafficZone'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "trafficZone"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      TrafficZone: {
        payload: Prisma.$TrafficZonePayload<ExtArgs>
        fields: Prisma.TrafficZoneFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TrafficZoneFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrafficZonePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TrafficZoneFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrafficZonePayload>
          }
          findFirst: {
            args: Prisma.TrafficZoneFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrafficZonePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TrafficZoneFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrafficZonePayload>
          }
          findMany: {
            args: Prisma.TrafficZoneFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrafficZonePayload>[]
          }
          create: {
            args: Prisma.TrafficZoneCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrafficZonePayload>
          }
          createMany: {
            args: Prisma.TrafficZoneCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TrafficZoneCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrafficZonePayload>[]
          }
          delete: {
            args: Prisma.TrafficZoneDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrafficZonePayload>
          }
          update: {
            args: Prisma.TrafficZoneUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrafficZonePayload>
          }
          deleteMany: {
            args: Prisma.TrafficZoneDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TrafficZoneUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TrafficZoneUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrafficZonePayload>[]
          }
          upsert: {
            args: Prisma.TrafficZoneUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrafficZonePayload>
          }
          aggregate: {
            args: Prisma.TrafficZoneAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTrafficZone>
          }
          groupBy: {
            args: Prisma.TrafficZoneGroupByArgs<ExtArgs>
            result: $Utils.Optional<TrafficZoneGroupByOutputType>[]
          }
          count: {
            args: Prisma.TrafficZoneCountArgs<ExtArgs>
            result: $Utils.Optional<TrafficZoneCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    trafficZone?: TrafficZoneOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */



  /**
   * Models
   */

  /**
   * Model TrafficZone
   */

  export type AggregateTrafficZone = {
    _count: TrafficZoneCountAggregateOutputType | null
    _avg: TrafficZoneAvgAggregateOutputType | null
    _sum: TrafficZoneSumAggregateOutputType | null
    _min: TrafficZoneMinAggregateOutputType | null
    _max: TrafficZoneMaxAggregateOutputType | null
  }

  export type TrafficZoneAvgAggregateOutputType = {
    latitude: Decimal | null
    longitude: Decimal | null
    radius: Decimal | null
    vehicleCount: number | null
    density: Decimal | null
  }

  export type TrafficZoneSumAggregateOutputType = {
    latitude: Decimal | null
    longitude: Decimal | null
    radius: Decimal | null
    vehicleCount: number | null
    density: Decimal | null
  }

  export type TrafficZoneMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    latitude: Decimal | null
    longitude: Decimal | null
    radius: Decimal | null
    vehicleCount: number | null
    density: Decimal | null
    congestionLevel: $Enums.CongestionLevel | null
    isCongested: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TrafficZoneMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    latitude: Decimal | null
    longitude: Decimal | null
    radius: Decimal | null
    vehicleCount: number | null
    density: Decimal | null
    congestionLevel: $Enums.CongestionLevel | null
    isCongested: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TrafficZoneCountAggregateOutputType = {
    id: number
    name: number
    description: number
    latitude: number
    longitude: number
    radius: number
    vehicleCount: number
    density: number
    congestionLevel: number
    isCongested: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TrafficZoneAvgAggregateInputType = {
    latitude?: true
    longitude?: true
    radius?: true
    vehicleCount?: true
    density?: true
  }

  export type TrafficZoneSumAggregateInputType = {
    latitude?: true
    longitude?: true
    radius?: true
    vehicleCount?: true
    density?: true
  }

  export type TrafficZoneMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    latitude?: true
    longitude?: true
    radius?: true
    vehicleCount?: true
    density?: true
    congestionLevel?: true
    isCongested?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TrafficZoneMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    latitude?: true
    longitude?: true
    radius?: true
    vehicleCount?: true
    density?: true
    congestionLevel?: true
    isCongested?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TrafficZoneCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    latitude?: true
    longitude?: true
    radius?: true
    vehicleCount?: true
    density?: true
    congestionLevel?: true
    isCongested?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TrafficZoneAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TrafficZone to aggregate.
     */
    where?: TrafficZoneWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TrafficZones to fetch.
     */
    orderBy?: TrafficZoneOrderByWithRelationInput | TrafficZoneOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TrafficZoneWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TrafficZones from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TrafficZones.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TrafficZones
    **/
    _count?: true | TrafficZoneCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TrafficZoneAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TrafficZoneSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TrafficZoneMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TrafficZoneMaxAggregateInputType
  }

  export type GetTrafficZoneAggregateType<T extends TrafficZoneAggregateArgs> = {
        [P in keyof T & keyof AggregateTrafficZone]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTrafficZone[P]>
      : GetScalarType<T[P], AggregateTrafficZone[P]>
  }




  export type TrafficZoneGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TrafficZoneWhereInput
    orderBy?: TrafficZoneOrderByWithAggregationInput | TrafficZoneOrderByWithAggregationInput[]
    by: TrafficZoneScalarFieldEnum[] | TrafficZoneScalarFieldEnum
    having?: TrafficZoneScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TrafficZoneCountAggregateInputType | true
    _avg?: TrafficZoneAvgAggregateInputType
    _sum?: TrafficZoneSumAggregateInputType
    _min?: TrafficZoneMinAggregateInputType
    _max?: TrafficZoneMaxAggregateInputType
  }

  export type TrafficZoneGroupByOutputType = {
    id: string
    name: string
    description: string | null
    latitude: Decimal
    longitude: Decimal
    radius: Decimal
    vehicleCount: number
    density: Decimal
    congestionLevel: $Enums.CongestionLevel
    isCongested: boolean
    createdAt: Date
    updatedAt: Date
    _count: TrafficZoneCountAggregateOutputType | null
    _avg: TrafficZoneAvgAggregateOutputType | null
    _sum: TrafficZoneSumAggregateOutputType | null
    _min: TrafficZoneMinAggregateOutputType | null
    _max: TrafficZoneMaxAggregateOutputType | null
  }

  type GetTrafficZoneGroupByPayload<T extends TrafficZoneGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TrafficZoneGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TrafficZoneGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TrafficZoneGroupByOutputType[P]>
            : GetScalarType<T[P], TrafficZoneGroupByOutputType[P]>
        }
      >
    >


  export type TrafficZoneSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    latitude?: boolean
    longitude?: boolean
    radius?: boolean
    vehicleCount?: boolean
    density?: boolean
    congestionLevel?: boolean
    isCongested?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["trafficZone"]>

  export type TrafficZoneSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    latitude?: boolean
    longitude?: boolean
    radius?: boolean
    vehicleCount?: boolean
    density?: boolean
    congestionLevel?: boolean
    isCongested?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["trafficZone"]>

  export type TrafficZoneSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    latitude?: boolean
    longitude?: boolean
    radius?: boolean
    vehicleCount?: boolean
    density?: boolean
    congestionLevel?: boolean
    isCongested?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["trafficZone"]>

  export type TrafficZoneSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    latitude?: boolean
    longitude?: boolean
    radius?: boolean
    vehicleCount?: boolean
    density?: boolean
    congestionLevel?: boolean
    isCongested?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TrafficZoneOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "latitude" | "longitude" | "radius" | "vehicleCount" | "density" | "congestionLevel" | "isCongested" | "createdAt" | "updatedAt", ExtArgs["result"]["trafficZone"]>

  export type $TrafficZonePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TrafficZone"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
      latitude: Prisma.Decimal
      longitude: Prisma.Decimal
      radius: Prisma.Decimal
      vehicleCount: number
      density: Prisma.Decimal
      congestionLevel: $Enums.CongestionLevel
      isCongested: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["trafficZone"]>
    composites: {}
  }

  type TrafficZoneGetPayload<S extends boolean | null | undefined | TrafficZoneDefaultArgs> = $Result.GetResult<Prisma.$TrafficZonePayload, S>

  type TrafficZoneCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TrafficZoneFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TrafficZoneCountAggregateInputType | true
    }

  export interface TrafficZoneDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TrafficZone'], meta: { name: 'TrafficZone' } }
    /**
     * Find zero or one TrafficZone that matches the filter.
     * @param {TrafficZoneFindUniqueArgs} args - Arguments to find a TrafficZone
     * @example
     * // Get one TrafficZone
     * const trafficZone = await prisma.trafficZone.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TrafficZoneFindUniqueArgs>(args: SelectSubset<T, TrafficZoneFindUniqueArgs<ExtArgs>>): Prisma__TrafficZoneClient<$Result.GetResult<Prisma.$TrafficZonePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TrafficZone that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TrafficZoneFindUniqueOrThrowArgs} args - Arguments to find a TrafficZone
     * @example
     * // Get one TrafficZone
     * const trafficZone = await prisma.trafficZone.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TrafficZoneFindUniqueOrThrowArgs>(args: SelectSubset<T, TrafficZoneFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TrafficZoneClient<$Result.GetResult<Prisma.$TrafficZonePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TrafficZone that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrafficZoneFindFirstArgs} args - Arguments to find a TrafficZone
     * @example
     * // Get one TrafficZone
     * const trafficZone = await prisma.trafficZone.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TrafficZoneFindFirstArgs>(args?: SelectSubset<T, TrafficZoneFindFirstArgs<ExtArgs>>): Prisma__TrafficZoneClient<$Result.GetResult<Prisma.$TrafficZonePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TrafficZone that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrafficZoneFindFirstOrThrowArgs} args - Arguments to find a TrafficZone
     * @example
     * // Get one TrafficZone
     * const trafficZone = await prisma.trafficZone.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TrafficZoneFindFirstOrThrowArgs>(args?: SelectSubset<T, TrafficZoneFindFirstOrThrowArgs<ExtArgs>>): Prisma__TrafficZoneClient<$Result.GetResult<Prisma.$TrafficZonePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TrafficZones that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrafficZoneFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TrafficZones
     * const trafficZones = await prisma.trafficZone.findMany()
     * 
     * // Get first 10 TrafficZones
     * const trafficZones = await prisma.trafficZone.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const trafficZoneWithIdOnly = await prisma.trafficZone.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TrafficZoneFindManyArgs>(args?: SelectSubset<T, TrafficZoneFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TrafficZonePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TrafficZone.
     * @param {TrafficZoneCreateArgs} args - Arguments to create a TrafficZone.
     * @example
     * // Create one TrafficZone
     * const TrafficZone = await prisma.trafficZone.create({
     *   data: {
     *     // ... data to create a TrafficZone
     *   }
     * })
     * 
     */
    create<T extends TrafficZoneCreateArgs>(args: SelectSubset<T, TrafficZoneCreateArgs<ExtArgs>>): Prisma__TrafficZoneClient<$Result.GetResult<Prisma.$TrafficZonePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TrafficZones.
     * @param {TrafficZoneCreateManyArgs} args - Arguments to create many TrafficZones.
     * @example
     * // Create many TrafficZones
     * const trafficZone = await prisma.trafficZone.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TrafficZoneCreateManyArgs>(args?: SelectSubset<T, TrafficZoneCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TrafficZones and returns the data saved in the database.
     * @param {TrafficZoneCreateManyAndReturnArgs} args - Arguments to create many TrafficZones.
     * @example
     * // Create many TrafficZones
     * const trafficZone = await prisma.trafficZone.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TrafficZones and only return the `id`
     * const trafficZoneWithIdOnly = await prisma.trafficZone.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TrafficZoneCreateManyAndReturnArgs>(args?: SelectSubset<T, TrafficZoneCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TrafficZonePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TrafficZone.
     * @param {TrafficZoneDeleteArgs} args - Arguments to delete one TrafficZone.
     * @example
     * // Delete one TrafficZone
     * const TrafficZone = await prisma.trafficZone.delete({
     *   where: {
     *     // ... filter to delete one TrafficZone
     *   }
     * })
     * 
     */
    delete<T extends TrafficZoneDeleteArgs>(args: SelectSubset<T, TrafficZoneDeleteArgs<ExtArgs>>): Prisma__TrafficZoneClient<$Result.GetResult<Prisma.$TrafficZonePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TrafficZone.
     * @param {TrafficZoneUpdateArgs} args - Arguments to update one TrafficZone.
     * @example
     * // Update one TrafficZone
     * const trafficZone = await prisma.trafficZone.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TrafficZoneUpdateArgs>(args: SelectSubset<T, TrafficZoneUpdateArgs<ExtArgs>>): Prisma__TrafficZoneClient<$Result.GetResult<Prisma.$TrafficZonePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TrafficZones.
     * @param {TrafficZoneDeleteManyArgs} args - Arguments to filter TrafficZones to delete.
     * @example
     * // Delete a few TrafficZones
     * const { count } = await prisma.trafficZone.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TrafficZoneDeleteManyArgs>(args?: SelectSubset<T, TrafficZoneDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TrafficZones.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrafficZoneUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TrafficZones
     * const trafficZone = await prisma.trafficZone.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TrafficZoneUpdateManyArgs>(args: SelectSubset<T, TrafficZoneUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TrafficZones and returns the data updated in the database.
     * @param {TrafficZoneUpdateManyAndReturnArgs} args - Arguments to update many TrafficZones.
     * @example
     * // Update many TrafficZones
     * const trafficZone = await prisma.trafficZone.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TrafficZones and only return the `id`
     * const trafficZoneWithIdOnly = await prisma.trafficZone.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TrafficZoneUpdateManyAndReturnArgs>(args: SelectSubset<T, TrafficZoneUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TrafficZonePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TrafficZone.
     * @param {TrafficZoneUpsertArgs} args - Arguments to update or create a TrafficZone.
     * @example
     * // Update or create a TrafficZone
     * const trafficZone = await prisma.trafficZone.upsert({
     *   create: {
     *     // ... data to create a TrafficZone
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TrafficZone we want to update
     *   }
     * })
     */
    upsert<T extends TrafficZoneUpsertArgs>(args: SelectSubset<T, TrafficZoneUpsertArgs<ExtArgs>>): Prisma__TrafficZoneClient<$Result.GetResult<Prisma.$TrafficZonePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TrafficZones.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrafficZoneCountArgs} args - Arguments to filter TrafficZones to count.
     * @example
     * // Count the number of TrafficZones
     * const count = await prisma.trafficZone.count({
     *   where: {
     *     // ... the filter for the TrafficZones we want to count
     *   }
     * })
    **/
    count<T extends TrafficZoneCountArgs>(
      args?: Subset<T, TrafficZoneCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TrafficZoneCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TrafficZone.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrafficZoneAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TrafficZoneAggregateArgs>(args: Subset<T, TrafficZoneAggregateArgs>): Prisma.PrismaPromise<GetTrafficZoneAggregateType<T>>

    /**
     * Group by TrafficZone.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrafficZoneGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TrafficZoneGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TrafficZoneGroupByArgs['orderBy'] }
        : { orderBy?: TrafficZoneGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TrafficZoneGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTrafficZoneGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TrafficZone model
   */
  readonly fields: TrafficZoneFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TrafficZone.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TrafficZoneClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TrafficZone model
   */
  interface TrafficZoneFieldRefs {
    readonly id: FieldRef<"TrafficZone", 'String'>
    readonly name: FieldRef<"TrafficZone", 'String'>
    readonly description: FieldRef<"TrafficZone", 'String'>
    readonly latitude: FieldRef<"TrafficZone", 'Decimal'>
    readonly longitude: FieldRef<"TrafficZone", 'Decimal'>
    readonly radius: FieldRef<"TrafficZone", 'Decimal'>
    readonly vehicleCount: FieldRef<"TrafficZone", 'Int'>
    readonly density: FieldRef<"TrafficZone", 'Decimal'>
    readonly congestionLevel: FieldRef<"TrafficZone", 'CongestionLevel'>
    readonly isCongested: FieldRef<"TrafficZone", 'Boolean'>
    readonly createdAt: FieldRef<"TrafficZone", 'DateTime'>
    readonly updatedAt: FieldRef<"TrafficZone", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TrafficZone findUnique
   */
  export type TrafficZoneFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrafficZone
     */
    select?: TrafficZoneSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrafficZone
     */
    omit?: TrafficZoneOmit<ExtArgs> | null
    /**
     * Filter, which TrafficZone to fetch.
     */
    where: TrafficZoneWhereUniqueInput
  }

  /**
   * TrafficZone findUniqueOrThrow
   */
  export type TrafficZoneFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrafficZone
     */
    select?: TrafficZoneSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrafficZone
     */
    omit?: TrafficZoneOmit<ExtArgs> | null
    /**
     * Filter, which TrafficZone to fetch.
     */
    where: TrafficZoneWhereUniqueInput
  }

  /**
   * TrafficZone findFirst
   */
  export type TrafficZoneFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrafficZone
     */
    select?: TrafficZoneSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrafficZone
     */
    omit?: TrafficZoneOmit<ExtArgs> | null
    /**
     * Filter, which TrafficZone to fetch.
     */
    where?: TrafficZoneWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TrafficZones to fetch.
     */
    orderBy?: TrafficZoneOrderByWithRelationInput | TrafficZoneOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TrafficZones.
     */
    cursor?: TrafficZoneWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TrafficZones from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TrafficZones.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TrafficZones.
     */
    distinct?: TrafficZoneScalarFieldEnum | TrafficZoneScalarFieldEnum[]
  }

  /**
   * TrafficZone findFirstOrThrow
   */
  export type TrafficZoneFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrafficZone
     */
    select?: TrafficZoneSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrafficZone
     */
    omit?: TrafficZoneOmit<ExtArgs> | null
    /**
     * Filter, which TrafficZone to fetch.
     */
    where?: TrafficZoneWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TrafficZones to fetch.
     */
    orderBy?: TrafficZoneOrderByWithRelationInput | TrafficZoneOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TrafficZones.
     */
    cursor?: TrafficZoneWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TrafficZones from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TrafficZones.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TrafficZones.
     */
    distinct?: TrafficZoneScalarFieldEnum | TrafficZoneScalarFieldEnum[]
  }

  /**
   * TrafficZone findMany
   */
  export type TrafficZoneFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrafficZone
     */
    select?: TrafficZoneSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrafficZone
     */
    omit?: TrafficZoneOmit<ExtArgs> | null
    /**
     * Filter, which TrafficZones to fetch.
     */
    where?: TrafficZoneWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TrafficZones to fetch.
     */
    orderBy?: TrafficZoneOrderByWithRelationInput | TrafficZoneOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TrafficZones.
     */
    cursor?: TrafficZoneWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TrafficZones from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TrafficZones.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TrafficZones.
     */
    distinct?: TrafficZoneScalarFieldEnum | TrafficZoneScalarFieldEnum[]
  }

  /**
   * TrafficZone create
   */
  export type TrafficZoneCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrafficZone
     */
    select?: TrafficZoneSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrafficZone
     */
    omit?: TrafficZoneOmit<ExtArgs> | null
    /**
     * The data needed to create a TrafficZone.
     */
    data: XOR<TrafficZoneCreateInput, TrafficZoneUncheckedCreateInput>
  }

  /**
   * TrafficZone createMany
   */
  export type TrafficZoneCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TrafficZones.
     */
    data: TrafficZoneCreateManyInput | TrafficZoneCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TrafficZone createManyAndReturn
   */
  export type TrafficZoneCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrafficZone
     */
    select?: TrafficZoneSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TrafficZone
     */
    omit?: TrafficZoneOmit<ExtArgs> | null
    /**
     * The data used to create many TrafficZones.
     */
    data: TrafficZoneCreateManyInput | TrafficZoneCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TrafficZone update
   */
  export type TrafficZoneUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrafficZone
     */
    select?: TrafficZoneSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrafficZone
     */
    omit?: TrafficZoneOmit<ExtArgs> | null
    /**
     * The data needed to update a TrafficZone.
     */
    data: XOR<TrafficZoneUpdateInput, TrafficZoneUncheckedUpdateInput>
    /**
     * Choose, which TrafficZone to update.
     */
    where: TrafficZoneWhereUniqueInput
  }

  /**
   * TrafficZone updateMany
   */
  export type TrafficZoneUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TrafficZones.
     */
    data: XOR<TrafficZoneUpdateManyMutationInput, TrafficZoneUncheckedUpdateManyInput>
    /**
     * Filter which TrafficZones to update
     */
    where?: TrafficZoneWhereInput
    /**
     * Limit how many TrafficZones to update.
     */
    limit?: number
  }

  /**
   * TrafficZone updateManyAndReturn
   */
  export type TrafficZoneUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrafficZone
     */
    select?: TrafficZoneSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TrafficZone
     */
    omit?: TrafficZoneOmit<ExtArgs> | null
    /**
     * The data used to update TrafficZones.
     */
    data: XOR<TrafficZoneUpdateManyMutationInput, TrafficZoneUncheckedUpdateManyInput>
    /**
     * Filter which TrafficZones to update
     */
    where?: TrafficZoneWhereInput
    /**
     * Limit how many TrafficZones to update.
     */
    limit?: number
  }

  /**
   * TrafficZone upsert
   */
  export type TrafficZoneUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrafficZone
     */
    select?: TrafficZoneSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrafficZone
     */
    omit?: TrafficZoneOmit<ExtArgs> | null
    /**
     * The filter to search for the TrafficZone to update in case it exists.
     */
    where: TrafficZoneWhereUniqueInput
    /**
     * In case the TrafficZone found by the `where` argument doesn't exist, create a new TrafficZone with this data.
     */
    create: XOR<TrafficZoneCreateInput, TrafficZoneUncheckedCreateInput>
    /**
     * In case the TrafficZone was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TrafficZoneUpdateInput, TrafficZoneUncheckedUpdateInput>
  }

  /**
   * TrafficZone delete
   */
  export type TrafficZoneDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrafficZone
     */
    select?: TrafficZoneSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrafficZone
     */
    omit?: TrafficZoneOmit<ExtArgs> | null
    /**
     * Filter which TrafficZone to delete.
     */
    where: TrafficZoneWhereUniqueInput
  }

  /**
   * TrafficZone deleteMany
   */
  export type TrafficZoneDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TrafficZones to delete
     */
    where?: TrafficZoneWhereInput
    /**
     * Limit how many TrafficZones to delete.
     */
    limit?: number
  }

  /**
   * TrafficZone without action
   */
  export type TrafficZoneDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrafficZone
     */
    select?: TrafficZoneSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrafficZone
     */
    omit?: TrafficZoneOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const TrafficZoneScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    latitude: 'latitude',
    longitude: 'longitude',
    radius: 'radius',
    vehicleCount: 'vehicleCount',
    density: 'density',
    congestionLevel: 'congestionLevel',
    isCongested: 'isCongested',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TrafficZoneScalarFieldEnum = (typeof TrafficZoneScalarFieldEnum)[keyof typeof TrafficZoneScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'CongestionLevel'
   */
  export type EnumCongestionLevelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CongestionLevel'>
    


  /**
   * Reference to a field of type 'CongestionLevel[]'
   */
  export type ListEnumCongestionLevelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CongestionLevel[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type TrafficZoneWhereInput = {
    AND?: TrafficZoneWhereInput | TrafficZoneWhereInput[]
    OR?: TrafficZoneWhereInput[]
    NOT?: TrafficZoneWhereInput | TrafficZoneWhereInput[]
    id?: UuidFilter<"TrafficZone"> | string
    name?: StringFilter<"TrafficZone"> | string
    description?: StringNullableFilter<"TrafficZone"> | string | null
    latitude?: DecimalFilter<"TrafficZone"> | Decimal | DecimalJsLike | number | string
    longitude?: DecimalFilter<"TrafficZone"> | Decimal | DecimalJsLike | number | string
    radius?: DecimalFilter<"TrafficZone"> | Decimal | DecimalJsLike | number | string
    vehicleCount?: IntFilter<"TrafficZone"> | number
    density?: DecimalFilter<"TrafficZone"> | Decimal | DecimalJsLike | number | string
    congestionLevel?: EnumCongestionLevelFilter<"TrafficZone"> | $Enums.CongestionLevel
    isCongested?: BoolFilter<"TrafficZone"> | boolean
    createdAt?: DateTimeFilter<"TrafficZone"> | Date | string
    updatedAt?: DateTimeFilter<"TrafficZone"> | Date | string
  }

  export type TrafficZoneOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    radius?: SortOrder
    vehicleCount?: SortOrder
    density?: SortOrder
    congestionLevel?: SortOrder
    isCongested?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TrafficZoneWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: TrafficZoneWhereInput | TrafficZoneWhereInput[]
    OR?: TrafficZoneWhereInput[]
    NOT?: TrafficZoneWhereInput | TrafficZoneWhereInput[]
    description?: StringNullableFilter<"TrafficZone"> | string | null
    latitude?: DecimalFilter<"TrafficZone"> | Decimal | DecimalJsLike | number | string
    longitude?: DecimalFilter<"TrafficZone"> | Decimal | DecimalJsLike | number | string
    radius?: DecimalFilter<"TrafficZone"> | Decimal | DecimalJsLike | number | string
    vehicleCount?: IntFilter<"TrafficZone"> | number
    density?: DecimalFilter<"TrafficZone"> | Decimal | DecimalJsLike | number | string
    congestionLevel?: EnumCongestionLevelFilter<"TrafficZone"> | $Enums.CongestionLevel
    isCongested?: BoolFilter<"TrafficZone"> | boolean
    createdAt?: DateTimeFilter<"TrafficZone"> | Date | string
    updatedAt?: DateTimeFilter<"TrafficZone"> | Date | string
  }, "id" | "name">

  export type TrafficZoneOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    radius?: SortOrder
    vehicleCount?: SortOrder
    density?: SortOrder
    congestionLevel?: SortOrder
    isCongested?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TrafficZoneCountOrderByAggregateInput
    _avg?: TrafficZoneAvgOrderByAggregateInput
    _max?: TrafficZoneMaxOrderByAggregateInput
    _min?: TrafficZoneMinOrderByAggregateInput
    _sum?: TrafficZoneSumOrderByAggregateInput
  }

  export type TrafficZoneScalarWhereWithAggregatesInput = {
    AND?: TrafficZoneScalarWhereWithAggregatesInput | TrafficZoneScalarWhereWithAggregatesInput[]
    OR?: TrafficZoneScalarWhereWithAggregatesInput[]
    NOT?: TrafficZoneScalarWhereWithAggregatesInput | TrafficZoneScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"TrafficZone"> | string
    name?: StringWithAggregatesFilter<"TrafficZone"> | string
    description?: StringNullableWithAggregatesFilter<"TrafficZone"> | string | null
    latitude?: DecimalWithAggregatesFilter<"TrafficZone"> | Decimal | DecimalJsLike | number | string
    longitude?: DecimalWithAggregatesFilter<"TrafficZone"> | Decimal | DecimalJsLike | number | string
    radius?: DecimalWithAggregatesFilter<"TrafficZone"> | Decimal | DecimalJsLike | number | string
    vehicleCount?: IntWithAggregatesFilter<"TrafficZone"> | number
    density?: DecimalWithAggregatesFilter<"TrafficZone"> | Decimal | DecimalJsLike | number | string
    congestionLevel?: EnumCongestionLevelWithAggregatesFilter<"TrafficZone"> | $Enums.CongestionLevel
    isCongested?: BoolWithAggregatesFilter<"TrafficZone"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"TrafficZone"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"TrafficZone"> | Date | string
  }

  export type TrafficZoneCreateInput = {
    id?: string
    name: string
    description?: string | null
    latitude: Decimal | DecimalJsLike | number | string
    longitude: Decimal | DecimalJsLike | number | string
    radius: Decimal | DecimalJsLike | number | string
    vehicleCount?: number
    density?: Decimal | DecimalJsLike | number | string
    congestionLevel?: $Enums.CongestionLevel
    isCongested?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TrafficZoneUncheckedCreateInput = {
    id?: string
    name: string
    description?: string | null
    latitude: Decimal | DecimalJsLike | number | string
    longitude: Decimal | DecimalJsLike | number | string
    radius: Decimal | DecimalJsLike | number | string
    vehicleCount?: number
    density?: Decimal | DecimalJsLike | number | string
    congestionLevel?: $Enums.CongestionLevel
    isCongested?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TrafficZoneUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    longitude?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    radius?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    vehicleCount?: IntFieldUpdateOperationsInput | number
    density?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    congestionLevel?: EnumCongestionLevelFieldUpdateOperationsInput | $Enums.CongestionLevel
    isCongested?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TrafficZoneUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    longitude?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    radius?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    vehicleCount?: IntFieldUpdateOperationsInput | number
    density?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    congestionLevel?: EnumCongestionLevelFieldUpdateOperationsInput | $Enums.CongestionLevel
    isCongested?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TrafficZoneCreateManyInput = {
    id?: string
    name: string
    description?: string | null
    latitude: Decimal | DecimalJsLike | number | string
    longitude: Decimal | DecimalJsLike | number | string
    radius: Decimal | DecimalJsLike | number | string
    vehicleCount?: number
    density?: Decimal | DecimalJsLike | number | string
    congestionLevel?: $Enums.CongestionLevel
    isCongested?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TrafficZoneUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    longitude?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    radius?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    vehicleCount?: IntFieldUpdateOperationsInput | number
    density?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    congestionLevel?: EnumCongestionLevelFieldUpdateOperationsInput | $Enums.CongestionLevel
    isCongested?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TrafficZoneUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    longitude?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    radius?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    vehicleCount?: IntFieldUpdateOperationsInput | number
    density?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    congestionLevel?: EnumCongestionLevelFieldUpdateOperationsInput | $Enums.CongestionLevel
    isCongested?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type EnumCongestionLevelFilter<$PrismaModel = never> = {
    equals?: $Enums.CongestionLevel | EnumCongestionLevelFieldRefInput<$PrismaModel>
    in?: $Enums.CongestionLevel[] | ListEnumCongestionLevelFieldRefInput<$PrismaModel>
    notIn?: $Enums.CongestionLevel[] | ListEnumCongestionLevelFieldRefInput<$PrismaModel>
    not?: NestedEnumCongestionLevelFilter<$PrismaModel> | $Enums.CongestionLevel
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type TrafficZoneCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    radius?: SortOrder
    vehicleCount?: SortOrder
    density?: SortOrder
    congestionLevel?: SortOrder
    isCongested?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TrafficZoneAvgOrderByAggregateInput = {
    latitude?: SortOrder
    longitude?: SortOrder
    radius?: SortOrder
    vehicleCount?: SortOrder
    density?: SortOrder
  }

  export type TrafficZoneMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    radius?: SortOrder
    vehicleCount?: SortOrder
    density?: SortOrder
    congestionLevel?: SortOrder
    isCongested?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TrafficZoneMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    radius?: SortOrder
    vehicleCount?: SortOrder
    density?: SortOrder
    congestionLevel?: SortOrder
    isCongested?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TrafficZoneSumOrderByAggregateInput = {
    latitude?: SortOrder
    longitude?: SortOrder
    radius?: SortOrder
    vehicleCount?: SortOrder
    density?: SortOrder
  }

  export type UuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type EnumCongestionLevelWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CongestionLevel | EnumCongestionLevelFieldRefInput<$PrismaModel>
    in?: $Enums.CongestionLevel[] | ListEnumCongestionLevelFieldRefInput<$PrismaModel>
    notIn?: $Enums.CongestionLevel[] | ListEnumCongestionLevelFieldRefInput<$PrismaModel>
    not?: NestedEnumCongestionLevelWithAggregatesFilter<$PrismaModel> | $Enums.CongestionLevel
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumCongestionLevelFilter<$PrismaModel>
    _max?: NestedEnumCongestionLevelFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnumCongestionLevelFieldUpdateOperationsInput = {
    set?: $Enums.CongestionLevel
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NestedUuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedEnumCongestionLevelFilter<$PrismaModel = never> = {
    equals?: $Enums.CongestionLevel | EnumCongestionLevelFieldRefInput<$PrismaModel>
    in?: $Enums.CongestionLevel[] | ListEnumCongestionLevelFieldRefInput<$PrismaModel>
    notIn?: $Enums.CongestionLevel[] | ListEnumCongestionLevelFieldRefInput<$PrismaModel>
    not?: NestedEnumCongestionLevelFilter<$PrismaModel> | $Enums.CongestionLevel
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedUuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedEnumCongestionLevelWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CongestionLevel | EnumCongestionLevelFieldRefInput<$PrismaModel>
    in?: $Enums.CongestionLevel[] | ListEnumCongestionLevelFieldRefInput<$PrismaModel>
    notIn?: $Enums.CongestionLevel[] | ListEnumCongestionLevelFieldRefInput<$PrismaModel>
    not?: NestedEnumCongestionLevelWithAggregatesFilter<$PrismaModel> | $Enums.CongestionLevel
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumCongestionLevelFilter<$PrismaModel>
    _max?: NestedEnumCongestionLevelFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}