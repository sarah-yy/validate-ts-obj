export const getOrdinalNumber = (rank: number) => {
  const ordinalNum = rank - (Math.floor(rank / 10) * 10);
  let ordinalSuffix: string = "th";
  switch (ordinalNum) {
    case 1:
      ordinalSuffix = "st";
      break;
    case 2:
      ordinalSuffix = "nd";
      break;
    case 3:
      ordinalSuffix = "rd";
      break;
    default:
      ordinalSuffix = "th";
      break;
  }
  return `${rank}${ordinalSuffix}`;
};