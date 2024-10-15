import { ActionRequest } from 'adminjs';
import cookies from 'cookie';

export const getRequestHeaders = (
  request: ActionRequest,
): { accessToken: string; origin: string } => {
  const symbols = Object.getOwnPropertySymbols(request);

  // Iterate over the symbols to find the one you're looking for
  const headersSymbol = symbols.find(
    (symbol) =>
      Symbol.keyFor(symbol) === 'kHeaders' ||
      symbol.toString() === 'Symbol(kHeaders)',
  )!;

  const { cookie, origin } = request[headersSymbol] as Record<
    'cookie' | 'origin',
    string
  >;

  const { accessToken } = cookies.parse(cookie) as Record<
    'accessToken',
    string
  >;

  return { accessToken, origin };
};
