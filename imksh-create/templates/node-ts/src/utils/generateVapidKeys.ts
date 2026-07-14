import webpush from "web-push";
import logger from "./logger.js";

const generateVapidKeys = () => {
  const vapidKeys = webpush.generateVAPIDKeys();
  logger.info("Generated VAPID Keys:");
  logger.info(`Public Key: ${vapidKeys.publicKey}`);
  logger.info(`Private Key: ${vapidKeys.privateKey}`);
  return vapidKeys;
};

export default generateVapidKeys;
