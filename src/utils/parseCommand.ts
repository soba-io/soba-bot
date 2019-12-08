import { SobaConfig } from "../types/sobaConfig";

export const parseCommand = (content: string, config: SobaConfig) => {
  const args = content
    .slice(config.prefix.length)
    .trim()
    .split(/ +/g);
  if (args.length < 1) return;

  const command = args.shift()!.toLowerCase();
  return command;
};
