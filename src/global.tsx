import { Button, message, notification } from 'antd';
import { useIntl } from 'umi';
import defaultSettings from '../config/defaultSettings';

const { pwa } = defaultSettings;
const isHttps = document.location.protocol === 'https:';

const clearCache = () => {
  // remove all caches
  if (window.caches) {
    caches
      .keys()
      .then((keys) => {
        keys.forEach((key) => {
          caches.delete(key);
        });
      })
      .catch((e) => console.log(e));
  }
};

// if pwa is true
if (pwa) {
  // Notify user if offline now
  window.addEventListener('sw.offline', () => {
    console.log(useIntl().formatMessage({ id: 'app.pwa.offline' }))
    // message.warning(useIntl().formatMessage({ id: 'app.pwa.offline' }));
  });

  // Pop up a prompt on the page asking the user if they want to use the latest version
  window.addEventListener('sw.updated', (event: Event) => {
    const e = event as CustomEvent;
    const reloadSW = async () => {
      // Check if there is sw whose state is waiting in ServiceWorkerRegistration
      // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration
      const worker = e.detail && e.detail.waiting;
      if (!worker) {
        return true;
      }
      // Send skip-waiting event to waiting SW with MessageChannel
      await new Promise((resolve, reject) => {
        const channel = new MessageChannel();
        channel.port1.onmessage = (msgEvent) => {
          if (msgEvent.data.error) {
            reject(msgEvent.data.error);
          } else {
            resolve(msgEvent.data);
          }
        };
        worker.postMessage({ type: 'skip-waiting' }, [channel.port2]);
      });

      clearCache();
      window.location.reload();
      return true;
    };
    const key = `open${Date.now()}`;
    const btn = (
      <Button
        type="primary"
        onClick={() => {
          notification.close(key);
          reloadSW();
        }}
      >
        {useIntl().formatMessage({ id: 'app.pwa.serviceworker.updated.ok' })}
      </Button>
    );
    notification.open({
      message: useIntl().formatMessage({ id: 'app.pwa.serviceworker.updated' }),
      description: useIntl().formatMessage({ id: 'app.pwa.serviceworker.updated.hint' }),
      btn,
      key,
      onClose: async () => null,
    });
  });
} else if ('serviceWorker' in navigator && isHttps) {
  // unregister service worker
  const { serviceWorker } = navigator;
  if (serviceWorker.getRegistrations) {
    serviceWorker.getRegistrations().then((sws) => {
      sws.forEach((sw) => {
        sw.unregister();
      });
    });
  }
  serviceWorker.getRegistration().then((sw) => {
    if (sw) sw.unregister();
  });

  clearCache();
}
declare global {
  interface Window {
    setSize: any;
    setWidth: any;
    map: any;
    mapLoad: boolean;
    cjObj: any;
    hdObj: any;
    polygon: { x: string; y: string }[] | null | undefined; // ??????
    layerModelLF: any;
    layerModelAJ: any;
    layerModelTCC: any;
    layerModelCRTD: any;
    ajSitId: string[]; // ?????????id
    layerIds: string[]; // 3dtiles id
    videoShow: boolean;
    videoList: any[];
    filterFaceList: any[];
    gateIndexCodes: string[]; // ???????????????id
    tlNum: number; // ???????????????id
    sqxDataArr: any[]; // ???????????????
    tlArr: any[]; // ????????????
  }
}
window.setSize = (res: number) => {
  const scale = document.documentElement.clientWidth / 1920;
  return res * scale;
};
window.setWidth = (res: number) => {
  const width = ((document.documentElement.clientWidth / 1920) * (382 * 0.924) * res) / 100;
  return width;
};
window.map = '';
window.mapLoad = false;
window.cjObj = {};
window.hdObj = {};
window.polygon = null;
window.layerModelLF = null;
window.layerModelAJ = null;
window.layerModelTCC = null;
window.layerModelTCC = null;
window.ajSitId = [];
window.layerIds = [];
window.tlNum = 0
window.tlArr = []
window.videoShow = false;
window.videoList = [];
window.gateIndexCodes = [];
window.sqxDataArr = [];
window.filterFaceList = [];
