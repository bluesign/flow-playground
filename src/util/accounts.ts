const accountAddressIndexes = ['6', '7', '8', '9','10'];
const accountAddresses = ['0x06', '0x07', '0x08', '0x09', '0x0a'];
export const storageMapByIndex = (index: number): string => {
  if (index < 0) return null;
  return accountAddresses[index];
};

export const storageMapByAddress = (address: string): number => {
  if (!address) return 0;
  return accountAddresses.indexOf(address);
};

export const addressToAccount = (address: string): string => {
  const acctNum = address.charAt(address.length - 1);
  return `0x0${acctNum}`;
};

export const accountIndexes = (): string[] => {
  return accountAddressIndexes;
};
