const ApyConfig: { [key: string]: number } = {};

if (process.env.NEXT_PUBLIC_ENV === "prod") {
  ApyConfig["LQM2cdzDY3".toLowerCase()] = 10;
} else {
  ApyConfig["LQM2cdzDY3".toLowerCase()] = 10;
  ApyConfig["W723RTUpoZ".toLowerCase()] = 10;
}

export { ApyConfig };
