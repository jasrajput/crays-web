import { createStore } from "solid-js/store";
import { andRD, andVersion, iosRD, iosVersion, Kind } from "../constants";
import {
  createContext,
  createEffect,
  onCleanup,
  useContext
} from "solid-js";
import {
  isConnected,
  readData,
  refreshSocketListeners,
  removeSocketListeners,
  socket,
  subsTo
} from "../sockets";
import {
  ContextChildren,
  NostrEOSE,
  NostrEvent,
  NostrEventContent,
  NostrEvents,
} from "../types/primal";
import { APP_ID } from "../App";
import { getLastSeen, subscribeToNotificationStats, unsubscribeToNotificationStats } from "../lib/notifications";
import { useAccountContext } from "./AccountContext";
import { timeNow } from "../utils";
import { useSettingsContext } from "./SettingsContext";
import { useAppContext } from "./AppContext";

export type WalletContextStore = {
//   notificationCount: number,
//   downloadsCount: number,
//   actions: {
//     resetNotificationCounter: () => void,
//   }
}

export const initialData = {
//   notificationCount: 0,
//   downloadsCount: 0,
};

export let notifSince = timeNow();

export const setNotifSince = (val: number) => {
  notifSince = val;
}

export const WalletContext = createContext<WalletContextStore>();

export const NotificationsProvider = (props: { children: ContextChildren }) => {

  const account = useAccountContext();
  const settings = useSettingsContext();
  const app = useAppContext();


  let notifSubscribed = '|';

  const notfiStatsSubId = () => `notif_stats_${notifSubscribed}_${APP_ID}`;

// ACTIONS --------------------------------------

// SOCKET HANDLERS ------------------------------

  const handleNotifStatsEvent = (content: NostrEventContent) => {
    if (content?.kind === Kind.NotificationStats) {
      const sum = Object.keys(content).reduce((acc, key) => {
        if (key === 'pubkey' || key == 'kind') {
          return acc;
        }

        // @ts-ignore
        return acc + content[key];
      }, 0);

      if (sum !== store.notificationCount) {
        updateStore('notificationCount', () => sum)
      }

      calculateDownloadCount();

    }
  }
  const onMessage = async (event: MessageEvent) => {
    const data = await readData(event);
    const message: NostrEvent | NostrEOSE | NostrEvents = JSON.parse(data);

    const [type, subId, content] = message;

    if (subId === notfiStatsSubId()) {
      if (type === 'EVENTS') {
        for (let i=0;i<content.length;i++) {
          const e = content[i];
          handleNotifStatsEvent(e);
        }

      }
      if (type === 'EVENT') {
        handleNotifStatsEvent(content);
      }
    }
  };

  const onSocketClose = (closeEvent: CloseEvent) => {
    const webSocket = closeEvent.target as WebSocket;

    removeSocketListeners(
      webSocket,
      { message: onMessage, close: onSocketClose },
    );
  };

// EFFECTS --------------------------------------

// STORES ---------------------------------------


  const [store, updateStore] = createStore<WalletContextStore>({
    // ...initialData,
    actions: {
    //   resetNotificationCounter,
    },
  });

// RENDER ---------------------------------------

  return (
    <WalletContext.Provider value={store}>
      {props.children}
    </WalletContext.Provider>
  );
}

export const useWalletContext = () => useContext(WalletContext);
