import { BigNumber } from '@waves/bignumber';
import { base64Encode } from '@waves/ts-lib-crypto';
import Long from 'long';
import * as protobuf from 'protobufjs/minimal';
import { proto } from './messages.proto.compiled';

protobuf.util.Long = Long;
protobuf.configure();

type SwapClientCallArg =
  | { type: 'integer'; value: BigNumber }
  | { type: 'binary'; value: string }
  | { type: 'string'; value: string }
  | { type: 'boolean'; value: boolean }
  | { type: 'list'; value: SwapClientCallArg[] };

export interface SwapClientInvokeParams {
  dApp: string;
  function: string;
  args: SwapClientCallArg[];
}

export type SwapClientErrorCode = proto.Response.Error.CODES;
export const SwapClientErrorCode = proto.Response.Error.CODES;

type SwapClientResult =
  | {
      type: 'error';
      code: SwapClientErrorCode;
    }
  | {
      type: 'data';
      invoke: SwapClientInvokeParams;
      priceImpact: number;
      toAmountCoins: BigNumber;
    };

interface SwapClientSubscribeParams {
  address: string;
  fromAmountCoins: BigNumber;
  fromAssetId: string;
  slippageTolerance: number;
  toAssetId: string;
}

interface SwapClientRequest extends SwapClientSubscribeParams {
  id: string;
}

class SwapClientConnectionError {}

type Subscriber = (
  err: SwapClientConnectionError | null,
  vendor?: string,
  response?: SwapClientResult
) => void;

function convertArg(
  arg: proto.Response.Exchange.Transaction.Argument
): SwapClientCallArg {
  switch (arg.value) {
    case 'integerValue':
      return {
        type: 'integer',
        value: new BigNumber(String(arg.integerValue)),
      };
    case 'binaryValue':
      return {
        type: 'binary',
        value: `base64:${base64Encode(arg.binaryValue)}`,
      };
    case 'stringValue':
      return {
        type: 'string',
        value: arg.stringValue,
      };
    case 'booleanValue':
      return {
        type: 'boolean',
        value: arg.booleanValue,
      };
    case 'list':
      return {
        type: 'list',
        value: arg.list.items.map(convertArg),
      };
    default:
      throw new Error(`Unexpected value of arg.value: ${arg.value}`);
  }
}

export class SwapClient {
  private activeRequest: SwapClientRequest | null = null;
  private closedByUser = false;
  private nextId = 1;
  private reconnectTimeout: number | null = null;
  private subscriber: Subscriber | null = null;
  private ws: WebSocket | null = null;

  private connect() {
    if (this.ws) {
      return;
    }

    this.ws = new WebSocket('wss://keeper-swap.wvservices.com/v2');
    this.ws.binaryType = 'arraybuffer';

    this.ws.onopen = () => {
      if (this.activeRequest) {
        this.send();
      }
    };

    this.ws.onmessage = event => {
      if (!this.activeRequest || !this.subscriber) {
        return;
      }

      const res = proto.Response.decode(new Uint8Array(event.data));

      if (res.id !== this.activeRequest.id) {
        return;
      }

      switch (res.exchange.result) {
        case 'data':
          this.subscriber(null, res.exchange.vendor, {
            type: 'data',
            invoke: {
              dApp: res.exchange.data.transaction.dApp,
              function: res.exchange.data.transaction.call.function,
              args: res.exchange.data.transaction.call.arguments.map(
                convertArg
              ),
            },
            priceImpact: res.exchange.data.priceImpact,
            toAmountCoins: new BigNumber(String(res.exchange.data.amount)),
          });
          break;
        case 'error':
          this.subscriber(null, res.exchange.vendor, {
            type: 'error',
            code: res.exchange.error.code,
          });
          break;
        default:
          throw new Error(
            `Unexpected value of res.exchange.result: ${res.exchange.result}`
          );
      }
    };

    this.ws.onclose = () => {
      if (this.ws) {
        this.ws.onopen = null;
        this.ws.onmessage = null;
        this.ws.onclose = null;
        this.ws = null;
      }

      if (this.closedByUser) {
        return;
      }

      if (this.subscriber) {
        this.subscriber(new SwapClientConnectionError());
      }

      this.reconnectTimeout = window.setTimeout(() => {
        this.connect();
      }, 5000);
    };
  }

  private send() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const {
        address,
        fromAmountCoins,
        id,
        fromAssetId,
        slippageTolerance,
        toAssetId,
      } = this.activeRequest;

      const encoded = proto.Request.encode(
        proto.Request.create({
          exchange: proto.Request.Exchange.create({
            address: address,
            amount: Long.fromString(fromAmountCoins.toFixed()),
            id,
            slippageTolerance,
            source: fromAssetId,
            target: toAssetId,
          }),
        })
      ).finish();

      this.ws.send(encoded);
    } else {
      this.connect();
    }
  }

  subscribe(input: SwapClientSubscribeParams, subscriber: Subscriber) {
    this.activeRequest = { ...input, id: String(this.nextId++) };
    this.subscriber = subscriber;
    this.send();

    return () => {
      this.activeRequest = null;
      this.subscriber = null;
    };
  }

  close() {
    this.closedByUser = true;

    if (this.ws) {
      this.ws.close();
    }

    if (this.reconnectTimeout != null) {
      window.clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }
}
