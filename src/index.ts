import createServer from "./base/server";
import config from "./config";
import logger from "./utils/logger";

const PORT = config.PORT as number;
const server = createServer();

server.listen(PORT, () => {
  logger.info(`Server is running on port: ${PORT}`);
});
