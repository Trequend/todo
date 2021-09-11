type Session = {
  _id: { $oid: string };
  sessionId: string;
  csrfToken: string;
  createdAt: Date;
  expires: Date;
  // deno-lint-ignore no-explicit-any
  data: { [key: string]: any };
};

export type RequestSession = {
  maxAge: number;
  readonly withCSRFToken: boolean;
  readonly sessionId: string;
  // deno-lint-ignore no-explicit-any
  data: { [key: string]: any };
  delete(): void;
};

export default Session;
