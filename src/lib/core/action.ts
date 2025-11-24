import type { ExtractErrorMapFromRes } from "../next/next-search-param-toast.client"

export type ActionFn<I extends any[], O> = (...args: I) => Promise<O>
export type AnyActionFn = ActionFn<any[], any>

export type ActionErrorMap<O> = ExtractErrorMapFromRes<O>

export type SerializedAction<I extends any[], O> = ActionFn<I, O> & {
  errors: ActionErrorMap<O>
}

export type Action<I extends any[], O> = {
  fn: ActionFn<I, O>,
  errors: ActionErrorMap<O>
  bind: typeof thisBindAction,
  partialBind: typeof thisPartialBindAction,
  serialize: () => SerializedAction<I, O>
}
export type AnyAction = Action<any[], any>

// Factory

export function createAction<I extends any[], O>(
  Opts: {
    fn: ActionFn<I, O>,
    errors: ActionErrorMap<O>
  }
) {
  return {
    fn: Opts.fn,
    errors: Opts.errors,
    bind: thisBindAction,
    partialBind: thisPartialBindAction,
    serialize: () => {
      const fn = Opts.fn
      const newfnFromCreateAction = Object.assign(fn, {
        errors: Opts.errors
      })
      return newfnFromCreateAction
    }
  }
}

function thisBindAction<A extends any[], B extends any[], R,>(
  this: Action<[...A, ...B], R>, ...args: A
) {
  return createAction({
    fn: this.fn.bind(this.fn, ...args),
    errors: this.errors,
  })
}
export function bindAction<A extends any[], B extends any[], R,>(
  action: SerializedAction<[...A, ...B], R>, ...args: A
) {
  return createAction({
    fn: action.bind(null, ...args),
    errors: action.errors,
  }).serialize()
}

function thisPartialBindAction<A extends B, B extends Record<any, any>, Out, Rest extends any[] = any[]>(
  this: Action<[A, ...Rest], Out>, args: B
) {
  const newFn = async (inputs: Omit<A, keyof B>, ...rest: Rest) =>
    this.fn({ ...inputs, ...args }, ...rest)

  return createAction({
    fn: newFn,
    errors: this.errors,
  })
}
export function partialBindAction<A extends B, B extends Record<any, any>, Out, Rest extends any[] = any[]>(
  action: Action<[A, ...Rest], Out>, args: B
) {
  // Incoming action.fn MUST be a server action marked with "use server"
  // (no way to enforce this via typescript)

  const oldFn = action.fn
  // Required so that we only pass the server action into `newFn`
  // (cannot pass server action thats inside objects)

  const newFn = async (inputs: Omit<A, keyof B>, ...rest: Rest) => {
    "use server" // no way to create partialBind without this
    // console.log("New Fn Passed! (partialBindSerializedAction)")
    return oldFn({ ...inputs, ...args }, ...rest)
  }

  return createAction({
    fn: newFn,
    errors: action.errors,
  })
}


const TEST = async () => {

  // Bind Test
  const myAction = createAction(createAction(createAction({
    fn: async (id: number, name: string) => { },
    errors: {
      a: "Error A occurred",
      b: "Error B occurred",
    }
  })))

  const myActionRes1 = myAction.bind(2, 'asdf')
  // @ts-expect-error first param requires number
  const myActionRes2 = myAction.bind('2', 'asdf')

  // const withNumberIdBind = <I extends [id: number], O>(action: Action<I, O>) => {
  const withNumberIdBind = <A extends number, B extends any[], O>(action: Action<[A, ...B], O>) => {
    return action.bind(42 as A)
  }

  const myActionRes3 = withNumberIdBind<32, [string], any>(myAction)





  // Partial Bind Test
  const myAction2 = createAction(createAction(createAction({
    fn: async (opts: { a: string, b: string }, opts2: boolean) => { },
    errors: {
      a: "Error A occurred",
      b: "Error B occurred",
    }
  })))
  const newAction2 = myAction2.partialBind({ a: 'test' })

  newAction2.fn({ b: 'value' }, true)

  // Creating a wrapper
  const actionWrapper2 = <Input extends { a: string }, Rest extends any[]>(action: Action<[Input, ...Rest], any>) => {
    const res = action.partialBind({ a: 'test' })
    return res
  }

  const actionWrapper2Res = actionWrapper2(myAction2).fn({ b: 'value' }, true)
  actionWrapper2(myAction2).bind({ b: 'value' }).fn(true)
  // @ts-expect-error missing 'c'
  const actionWrapper2Res2 = actionWrapper2(myAction2).fn({ c: 'value' })

  const myFn = createAction({
    fn: async (
      inputs: {
        name: string, age: number, user_id: string,
        project_id: string, auth_id: number, order_count: string,
        is_admin: boolean, is_employed: boolean,
      },
      debug: boolean,
      opts: { verbose: boolean, log: string, id: string, flag: number }
    ) => {
      return { success: "ok" }
    },
    errors: {}
  })

  const res = await myFn
    .partialBind({ name: "John", age: 30 })
    .partialBind({ auth_id: 789 })
    .partialBind({ is_admin: true })
    .partialBind({ is_employed: false })
    .partialBind({ project_id: "proj_456" })
    .bind({
      order_count: "5",
      user_id: "user_123",
    })
    .bind(true)
    .partialBind({ log: "Starting process", id: "log_001", flag: 1 })
    .fn({ verbose: true })

  res.success // yay

  // ---

  const myFn2 = createAction({
    fn: async (inputs: { name: string, age: number, user_id: string }) => {
      return { success: "ok" }
    },
    errors: {}
  })

  const res2 = myFn2
    .partialBind({ name: "John", age: 30 })

  res2.bind()

}


