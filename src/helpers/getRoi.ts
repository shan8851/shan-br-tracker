export const calculateROI = (buyIn: number, cashAmount: number) => {
  return cashAmount === 0 && buyIn !== 0
    ? -100
    : ((cashAmount - buyIn) / buyIn) * 100;
}
