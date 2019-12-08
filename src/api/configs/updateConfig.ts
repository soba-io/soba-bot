import { SobaBot } from "../..";
import { SobaConfig } from "../../types/sobaConfig";

export const updateConfig = async (sobaBot: SobaBot, config: SobaConfig) => {
  try {
    const res = await sobaBot.axios.put(`/discord_configs/save`, {
      discord_config: {
        ...config
      }
    });

    return res.data;
  } catch (e) {
    console.warn(e);
  }
};
