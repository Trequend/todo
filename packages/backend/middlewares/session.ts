import { oak } from "../deps.ts";
import type {
  ApplicationState,
  RequestSession,
  Session,
} from "../types/mod.ts";

type SessionOptions = {
  cookieName: string;
  initialMaxAge: number;
};

export default function session(
  options: SessionOptions,
): oak.Middleware<ApplicationState> {
  return async (context, next) => {
    const {
      session,
      initialized,
      withCSRFToken,
    } = await getSession(context, options);

    const requestSession = createRequestSession(session, withCSRFToken);
    context.state.session = requestSession;

    const { maxAge: previousMaxAge } = requestSession;
    const previousData = JSON.stringify(session.data);

    await next();

    if (initialized) {
      await modifySession(context, options, session, requestSession, {
        previousMaxAge,
        previousData,
      });
    } else {
      await initializeSession(context, options, session, requestSession);
    }
  };
}

async function getSession(
  context: oak.Context<ApplicationState>,
  options: SessionOptions,
) {
  const sessionId = await context.cookies.get(options.cookieName, {
    signed: true,
  });

  if (sessionId) {
    const session = await context.state.sessions.findOne({
      sessionId,
    });

    if (session) {
      const withCSRFToken =
        context.request.headers.get("X-XSRF-TOKEN") === session.csrfToken;
      return {
        initialized: true,
        withCSRFToken,
        session: session as Session,
      };
    } else {
      await deleteCookies(context, options);
    }
  }

  const date = Date.now();
  return {
    initialized: false,
    withCSRFToken: true,
    session: {
      _id: { $oid: "" },
      sessionId: crypto.randomUUID(),
      csrfToken: crypto.randomUUID(),
      createdAt: new Date(date),
      expires: new Date(date + options.initialMaxAge),
      data: {},
    } as Session,
  };
}

function createRequestSession(
  session: Session,
  withCSRFToken: boolean,
): RequestSession {
  const { expires, createdAt } = session;
  const maxAge = expires.valueOf() - createdAt.valueOf();
  return {
    maxAge,
    withCSRFToken,
    sessionId: session.sessionId,
    data: session.data,
    delete() {
      this.maxAge = 0;
    },
  };
}

async function modifySession(
  context: oak.Context<ApplicationState>,
  options: SessionOptions,
  session: Session,
  requestSession: RequestSession,
  previousState: {
    previousMaxAge: number;
    previousData: string;
  },
) {
  const { previousMaxAge, previousData } = previousState;

  const { maxAge } = requestSession;
  const data = JSON.stringify(requestSession.data);

  if (maxAge !== previousMaxAge) {
    const expires = new Date(
      session.createdAt.valueOf() + clampMaxAge(maxAge),
    );

    await setCookies(context, options, session, expires);

    await context.state.sessions.updateOne({ sessionId: session.sessionId }, {
      $set: {
        expires,
        data: data !== previousData ? requestSession.data : undefined,
      },
    });
  } else if (data !== previousData) {
    await context.state.sessions.updateOne({ sessionId: session.sessionId }, {
      $set: { data: requestSession.data },
    });
  }
}

async function initializeSession(
  context: oak.Context<ApplicationState>,
  options: SessionOptions,
  session: Session,
  requestSession: RequestSession,
) {
  const shouldInitialize = Object.values(session.data).length > 0;
  if (shouldInitialize) {
    const expires = new Date(
      session.createdAt.valueOf() + clampMaxAge(requestSession.maxAge),
    );

    await setCookies(context, options, session, expires);

    await context.state.sessions.insertOne({
      ...session,
      _id: undefined,
      expires,
    });
  }
}

function clampMaxAge(maxAge: number) {
  return maxAge < 0 ? 0 : maxAge;
}

async function setCookies(
  context: oak.Context<ApplicationState>,
  options: SessionOptions,
  session: Session,
  expires: Date,
) {
  const { sessionId, csrfToken } = session;
  await context.cookies.set(options.cookieName, sessionId, {
    signed: true,
    sameSite: "strict",
    httpOnly: true,
    expires,
  });
  await context.cookies.set("XSRF-TOKEN", csrfToken, {
    signed: true,
    sameSite: "strict",
    expires,
    httpOnly: false,
  });
}

async function deleteCookies(
  context: oak.Context<ApplicationState>,
  options: SessionOptions,
) {
  await context.cookies.set(options.cookieName, null, {
    signed: true,
    sameSite: "strict",
    httpOnly: true,
  });
  await context.cookies.set("XSRF-TOKEN", null, {
    signed: true,
    sameSite: "strict",
    httpOnly: false,
  });
}
